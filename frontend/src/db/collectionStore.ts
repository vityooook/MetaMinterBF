import { create } from "zustand";
import { NftCollectionDto } from "./dto";

export interface CollectionStore {
  collections: NftCollectionDto[];

  getCollection: (collectionHash: string) => NftCollectionDto | undefined;
  setCollections: (Collections: NftCollectionDto[]) => void;
  patchCollection: (
    collectionId: string,
    CollectionPartial: Partial<NftCollectionDto>
  ) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  getCollection: (collectionHash) => {
    return get().collections.find((q) => q.hash === collectionHash);
  },

  patchCollection: (collectionId, collectionPartial) => {
    set((state) => {
      const collections = [...state.collections];
      const index = collections.findIndex((q) => q._id === collectionId);

      if (index !== -1) {
        collections[index] = {
          ...collections[index],
          ...collectionPartial,
        };
      }

      return {
        ...state,
        collections: collections,
      };
    });
  },

  setCollections: (collections) => {
    set(() => ({
      collections,
    }));
  },
}));
