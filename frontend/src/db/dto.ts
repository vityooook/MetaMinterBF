type NftItemDto = {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
};

export type NftCollectionDto = {
  _id: string;
  owner_id: string;
  hash: string;
  title: string;
  description: string;
  deployed: boolean;
  items_minted: number;
  items_limit: number;
  items: NftItemDto[];
  links: string[];
  createdAt: string;
  updatedAt: string;
};
