import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { editCollection } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";
import { useCollectionStore } from "~/db/collectionStore";
import { useFormStore } from "../pages/create/store";

export const useEditMutation = () => {
  const { patchCollection } = useCollectionStore();
  const { reset } = useFormStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: editCollection,
    onSuccess: (collection) => {
      patchCollection(collection._id, collection);
      navigate(`/collections/${collection._id}`);
      reset();

      toast({
        title: "Collection is edited",
      });
    },
    onError: () => {
      toast({
        title: "Cannot edit collection.",
        variant: "destructive",
      });
    },
  });
};
