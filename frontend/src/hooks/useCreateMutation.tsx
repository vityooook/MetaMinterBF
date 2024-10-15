import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCollection } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";
import { useFormStore } from "../pages/create/store";

export const useCreateMutation = () => {
  const { addCollection } = useCollectionStore();
  const { reset } = useFormStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: (collection) => {
      addCollection(collection);
      navigate(`/collections/${collection._id}`);
      reset();

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
