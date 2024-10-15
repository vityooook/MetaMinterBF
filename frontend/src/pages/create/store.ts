import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CollectionFormData } from "../../db/zod";

const initialFormData: CollectionFormData = {
  image: "",
  name: "",
  description: "",
  itemsLimit: undefined,
  nftPrice: 0,
  links: [],
  nfts: [
    {
      image: "",
      name: "",
      description: "",
    },
  ],
  startTime: undefined,
  endTime: undefined,
};

export type FormStep = "collection" | "nft" | "settings" | "finish";

type FormStore = {
  step: FormStep;
  formData: CollectionFormData;
  set: (data: Partial<CollectionFormData>, step: FormStep) => void;
  reset: () => void;
};

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: initialFormData,
      step: "collection",

      set: (data, step) =>
        set((state) => ({
          formData: { ...state.formData, ...data }, // Merge new data into formData
          step, // Update the step
        })),

      reset: () => set({ formData: initialFormData, step: "collection" }), // Reset to initial state
    }),
    {
      name: "collection-form-store", // Name of the key in localStorage
      getStorage: () => localStorage, // Use localStorage
    }
  )
);
