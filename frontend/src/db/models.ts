import { User } from "@telegram-apps/sdk-react";
import { CollectionFormData, NftFormData } from "~/db/zod";

export type UserModel = User & {
  _id?: string;
  isNewUser: boolean;
};

export type NftModel = NftFormData & {
  _id?: string;
  image: string;
};

export type CollectionModel = CollectionFormData & {
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
