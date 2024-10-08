import { create } from "zustand";
import { CollectionModel } from "./models";

export interface CollectionStore {
  collections: CollectionModel[];

  getCollection: (collectionId: string) => CollectionModel | undefined;
  setCollections: (collections: CollectionModel[]) => void;
  addCollection: (newCollection: CollectionModel) => void; // New method
  patchCollection: (
    collectionId: string,
    collectionPartial: Partial<CollectionModel>
  ) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  getCollection: (collectionId) => {
    return get().collections.find((q) => q._id === collectionId);
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
