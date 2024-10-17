import { Address, address, beginCell, Cell, toNano } from "@ton/core";
import {
  NFT_COLLECTION_CODE_HEX,
  NFT_ITEM_CODE_HEX,
  MASTER_ADDRESS,
  config,
} from "~/config";
import {
  CollectionPayload,
  decodeContentItem,
  decodeOffChainContent,
  generateCollectionPayload,
  editData,
} from "~/lib/ton";
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
  referralAddress?: string;
  referralComission?: bigint;
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

export type EditData = {
  tonConnect: TonConnectUI;
  collectionAddress: Address;
  price: bigint;
  buyerLimit: number;
  startTime: number;
  endTime: number;
  available: number;
  ownerAddress: Address;
};

export interface CollectionContractActions {
  deploy: (data: SendCollectionData) => Promise<CollectionPayload>;
  mint: (data: MintNftData) => Promise<any>;
  edit: (data: EditData) => Promise<any>;
  getData: (collectionAddress: Address) => Promise<CollectionData>;
}
export class CollectionContract implements CollectionContractActions {
  constructor() {}

  async getData(collectionAddress: Address): Promise<any> {
    const response = await getTonClient((client) =>
      client.runMethod(collectionAddress, "get_collection_data", [])
    );

    const owner_user = response.stack.readAddress();
    const admin = response.stack.readAddress();
    const available = response.stack.readBoolean();
    const price = response.stack.readBigNumber();
    const totalMinted = response.stack.readNumber();
    const buyerLimit = response.stack.readNumber();
    const startTime = response.stack.readNumber();
    const endTime = response.stack.readNumber();
    const comission = response.stack.readBigNumber();
    const contentCollection = decodeOffChainContent(response.stack.readCell());
    const contentItem = decodeContentItem(response.stack.readCell());

    return {
      owner_user,
      admin,
      available,
      price,
      totalMinted,
      buyerLimit,
      startTime,
      endTime,
      comission,
      contentCollection,
      contentItem,
    };
  }

  async deploy({ tonConnect, userAddress, collection }: SendCollectionData) {
    // Подготавливаем аргументы для вызова функции generateCollectionPayload
    const payload = await generateCollectionPayload({
      nftCollectionCodeHex: NFT_COLLECTION_CODE_HEX,
      nftItemCodeHex: NFT_ITEM_CODE_HEX,
      admin: address(MASTER_ADDRESS),
      userOwner: address(userAddress),
      price: toNano(collection.nftPrice),
      buyerLimit: collection.itemsLimit || 0,
      startTime: collection.startTime
        ? Math.floor(Number(new Date(collection.startTime).getTime()) / 1000)
        : 0,
      endTime: collection.endTime
        ? Math.floor(Number(new Date(collection.endTime).getTime()) / 1000)
        : 0,
      collectionContent: `${config.apiUrl}/api/metadata/collection/${collection._id}.json`,
      itemContent: `${config.apiUrl}/api/metadata/nft/`,
      itemContentJson: `${collection.nfts[0]._id}.json`,
      commission: config.itemComission,
    });

    try {
      await tonConnect.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 90,
          messages: [
            {
              address: payload.address.toString(),
              amount: Number(config.deployComission).toString(),
              stateInit: payload.stateInitBase64,
              payload: payload.msgBody,
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

  async edit({
    tonConnect,
    collectionAddress,
    price,
    buyerLimit,
    startTime,
    endTime,
    available,
    ownerAddress,
  }: {
    tonConnect: TonConnectUI;
    collectionAddress: Address;
  } & Partial<Omit<EditData, "tonConnect" | "collectionAddress">>) {
    // Получаем текущие данные коллекции, если какие-то из значений не переданы
    const currentData = await this.getData(collectionAddress);

    const msgBody = await editData({
      price: price !== undefined ? toNano(price) : currentData.price, // Используем текущее значение, если новое не передано
      buyerLimit:
        buyerLimit !== undefined ? buyerLimit : currentData.buyerLimit,
      startTime:
        startTime !== undefined
          ? Math.floor(Number(new Date(startTime).getTime()) / 1000)
          : currentData.startTime,
      endTime:
        endTime !== undefined
          ? Math.floor(Number(new Date(endTime).getTime()) / 1000)
          : currentData.endTime,
      available: available !== undefined ? available : currentData.available,
      ownerAddress:
        ownerAddress !== undefined ? ownerAddress : currentData.owner_user,
    });

    try {
      return await tonConnect.sendTransaction(
        {
          validUntil: Math.floor(Date.now() / 1000) + 90,
          messages: [
            {
              address: collectionAddress.toString(),
              amount: toNano("0.01").toString(),
              payload: msgBody.body,
            },
          ],
        },
        tonConnectOptions
      );
    } catch (e) {
      throw new Error("Cannot edit collection data in TON");
    }
  }
}
