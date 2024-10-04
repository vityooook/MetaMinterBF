import { User } from "@telegram-apps/sdk-react";
import { CollectionFormData, ItemFormData } from "~/pages/collections/create/zod";

export type UserModel = User & {
  _id?: string;
};

export type NftItem = ItemFormData & {

}

export type NftCollection = CollectionFormData & {
  _id: string;
  hash: string;
  deployed: boolean;
  items: NftItem[];
  address: string;
};
