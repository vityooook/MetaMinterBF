import { useMutation } from "@tanstack/react-query";
import { publishCollection } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";
import { CollectionModel } from "~/db/models";

export const useDeployMutation = () => {
  const patchCollection = useCollectionStore((state) => state.patchCollection);

  return useMutation({
    mutationFn: publishCollection,
    onSuccess: (collection: CollectionModel) => {
      patchCollection(collection._id, collection);

      toast({
        title: "Success",
        description: "Collection successully deployed!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate payload",
        variant: "destructive",
      });
    },
  });
};
