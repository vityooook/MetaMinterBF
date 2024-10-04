import { create } from "zustand";
import { NftCollection } from "./models";

export interface CollectionStore {
  collections: NftCollection[];

  getCollection: (collectionHash: string) => NftCollection | undefined;
  setCollections: (collections: NftCollection[]) => void;
  addCollection: (newCollection: NftCollection) => void; // New method
  patchCollection: (
    collectionId: string,
    collectionPartial: Partial<NftCollection>
  ) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  getCollection: (collectionHash) => {
    return get().collections.find((q) => q.hash === collectionHash);
  },

  addCollection: (newCollection) => {
    set((state) => ({
      collections: [newCollection, ...state.collections], // Add the new collection
    }));
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
