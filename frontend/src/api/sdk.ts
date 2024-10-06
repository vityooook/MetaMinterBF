import { address, beginCell, Cell, toNano } from "@ton/core";
import {
  NFT_COLLECTION_CODE_HEX,
  NFT_ITEM_CODE_HEX,
  MASTER_ADDRESS,
  config,
} from "~/config";
import { CollectionPayload, generateNftCollectionPayload } from "~/lib/ton";
import { ActionConfiguration, TonConnectUI } from "@tonconnect/ui-react";

export const tonConnectOptions: ActionConfiguration = {
  modals: [],
  notifications: [],
  twaReturnUrl: "https://t.me/MetaMinterBot/app",
};

export type PublishCollectionData = {
  tonConnect: TonConnectUI;
  userAddress: string;
  collectionId: string;
  itemId: string;
  price: number;
  limit?: number;
  startTime?: string;
  endTime?: string;
};

export type MintNftData = {
  tonConnect: TonConnectUI;
  userAddress: string;
  collectionAddress: string;
  price: number;
  quantity: number;
};

export interface ISDK {
  publishCollection: (
    data: PublishCollectionData
  ) => Promise<CollectionPayload>;

  mintNft: (data: MintNftData) => Promise<any>;
}
export class SDK implements ISDK {
  constructor() {}

  private createBodyMessage(quantity: number): Cell {
    return beginCell()
      .storeUint(1, 32)
      .storeUint(0, 64)
      .storeUint(quantity, 32)
      .endCell();
  }

  async mintNft({
    tonConnect,
    collectionAddress,
    price,
    quantity,
  }: MintNftData) {
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

  async publishCollection({
    tonConnect,
    userAddress,
    collectionId,
    itemId,
    price,
    limit,
    startTime,
    endTime,
  }: PublishCollectionData) {
    const payload = await generateNftCollectionPayload({
      nftCollectionCodeHex: NFT_COLLECTION_CODE_HEX,
      nftItemCodeHex: NFT_ITEM_CODE_HEX,
      admin: address(MASTER_ADDRESS),
      userOwner: address(userAddress),
      price: toNano(price),
      buyerLimit: limit || 1,
      startTime: startTime ? Math.floor(Number(startTime) / 1000) : 0,
      endTime: startTime ? Math.floor(Number(endTime) / 1000) : 0,
      collectionContent: `${config.apiUrl}/api/metadata/collection/${collectionId}.json`,
      itemContent: `${config.apiUrl}/api/metadata/nft/`,
      itemContentJson: `${itemId}.json`,
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
      throw new Error("Cannot publish collection in TON");
    }
  }
}
