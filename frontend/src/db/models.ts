import { User } from "@telegram-apps/sdk-react";
import { CreateCollectionData, NftData } from "~/pages/create/zod";

export type UserModel = User & {
  _id?: string;
  isOnboarded: boolean;
};

export type NftModel = NftData & {
  _id?: string;
  image: string;
};

export type CollectionModel = CreateCollectionData & {
  _id: string;
  hash: string;
  deployed: boolean;
  deploying: boolean;
  nfts: NftModel[];
  address: string;
};

export type UploadedImageModel = {
  url: string;
};
