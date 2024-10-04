import { create } from "zustand";
import { NftCollection } from "./models";

export interface CollectionStore {
  collections: NftCollection[];

  getCollection: (collectionHash: string) => NftCollection | undefined;
  setCollections: (Collections: NftCollection[]) => void;
  patchCollection: (
    collectionId: string,
    CollectionPartial: Partial<NftCollection>
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
