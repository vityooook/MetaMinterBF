import { User } from "@telegram-apps/sdk-react";
import {
  CollectionFormData,
  ItemFormData,
} from "~/pages/create/zod";

export type UserModel = User & {
  _id?: string;
  isOnboarded: boolean;
};

export type NftItem = ItemFormData & {
  _id?: string;
  imageUrl: string;
};

export type NftCollection = CollectionFormData & {
  _id: string;
  hash: string;
  deployed: boolean;
  items: NftItem[];
  address: string;
  imageUrl?: string;
};
