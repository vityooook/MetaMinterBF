import { Address, address, beginCell, Cell, toNano } from "@ton/core";
import {
  NFT_COLLECTION_CODE_HEX,
  NFT_ITEM_CODE_HEX,
  MASTER_ADDRESS,
  config,
} from "~/config";
import { CollectionPayload, generateCollectionPayload } from "~/lib/ton";
import { ActionConfiguration, TonConnectUI } from "@tonconnect/ui-react";
import { CollectionModel } from "~/db/models";
import { getTonClient } from "~/lib/ton-client";

export const tonConnectOptions: ActionConfiguration = {
  modals: [],
  notifications: [],
  twaReturnUrl: "https://t.me/MetaMinterBot/app",
};

export type SendCollectionData = {
  tonConnect: TonConnectUI;
  userAddress: string;
  collection: CollectionModel;
};

export type MintNftData = {
  tonConnect: TonConnectUI;
  userAddress: string;
  collectionAddress: string;
  price: number;
  quantity: number;
};

export type CollectionData = {
  numberOfNFTs: number;
  collectionContent: Cell;
  ownerAddress: Address;
};

export interface CollectionContractActions {
  deploy: (data: SendCollectionData) => Promise<CollectionPayload>;
  mint: (data: MintNftData) => Promise<any>;
  getData: (collectionAddress: Address) => Promise<CollectionData>;
}
export class CollectionContract implements CollectionContractActions {
  constructor() {}

  async getData(collectionAddress: Address): Promise<any> {
    const response = await getTonClient((client) =>
      client.runMethod(collectionAddress, "get_collection_data", [])
    );

    const numberOfNFTs = response.stack.readNumber();
    const collectionContent = response.stack.readCell();
    const ownerAddress = response.stack.readAddressOpt();

    return { numberOfNFTs, collectionContent, ownerAddress };
  }

  async deploy({ tonConnect, userAddress, collection }: SendCollectionData) {
    console.log(collection.startTime, Number(new Date(collection.startTime!).getTime()))
    const payload = await generateCollectionPayload({
      nftCollectionCodeHex: NFT_COLLECTION_CODE_HEX,
      nftItemCodeHex: NFT_ITEM_CODE_HEX,
      admin: address(MASTER_ADDRESS),
      userOwner: address(userAddress),
      price: toNano(collection.nftPrice),
      buyerLimit: collection.itemsLimit || 1,
      startTime: collection.startTime
        ? Math.floor(Number(new Date(collection.startTime).getTime()) / 1000)
        : 0,
      endTime: collection.endTime
        ? Math.floor(Number(new Date(collection.endTime).getTime()) / 1000)
        : 0,
      collectionContent: `${config.apiUrl}/api/metadata/collection/${collection._id}.json`,
      itemContent: `${config.apiUrl}/api/metadata/nft/`,
      itemContentJson: `${collection.nfts[0]._id}.json`,
      commission: config.deployCommission,
    });

    try {
      await tonConnect.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 90,
          messages: [
            {
              address: payload.address.toString(),
              amount: Number(config.deployCommission).toString(),
              stateInit: payload.stateInitBase64,
            },
          ],
        },
        tonConnectOptions
      );

      return payload;
    } catch (e) {
      throw new Error("Cannot deploy collection in TON");
    }
  }

  private createBodyMessage(quantity: number): Cell {
    return beginCell()
      .storeUint(1, 32)
      .storeUint(0, 64)
      .storeUint(quantity, 32)
      .endCell();
  }

  async mint({ tonConnect, collectionAddress, price, quantity }: MintNftData) {
    try {
      return await tonConnect.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 90,
          messages: [
            {
              address: collectionAddress,
              amount: toNano(price * quantity).toString(),
              payload: this.createBodyMessage(quantity)
                .toBoc()
                .toString("base64"),
            },
          ],
        },
        tonConnectOptions
      );
    } catch (e) {
      throw new Error("Cannot mint nft in TON");
    }
  }
}
