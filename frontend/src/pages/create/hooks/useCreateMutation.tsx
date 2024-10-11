import { useMutation } from "@tanstack/react-query";
import { createCollection } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";

export const useCreateMutation = () => {
  const { addCollection } = useCollectionStore();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: (nftCollection) => {
      addCollection(nftCollection);

      toast({
        title: "Collection is created",
      });
    },
    onError: () => {
      toast({
        title: "Cannot create collection.",
        variant: "destructive",
      });
    },
  });
};
