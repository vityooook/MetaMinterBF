import { create } from "zustand";

export interface CollectionStore {
  Collections: CollectionDto[];

  getCollection: (collectionId: string) => CollectionDto | undefined;
  setCollections: (Collections: CollectionDto[]) => void;
  patchCollection: (
    collectionId: string,
    CollectionPartial: Partial<CollectionDto>
  ) => void;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  Collections: [],
  getCollection: (collectionId) => {
    return get().Collections.find((q) => q._id === collectionId);
  },

  patchCollection: (collectionId, CollectionPartial) => {
    set((state) => {
      const Collections = [...state.Collections];
      const index = Collections.findIndex((q) => q._id === collectionId);

      if (index !== -1) {
        Collections[index] = {
          ...Collections[index],
          ...CollectionPartial,
        };
      }

      return {
        ...state,
        Collections,
      };
    });
  },

  setCollections: (Collections) => {
    set(() => ({
      Collections: Collections,
    }));
  },
}));
