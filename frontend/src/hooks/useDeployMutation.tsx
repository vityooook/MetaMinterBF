import { useMutation } from "@tanstack/react-query";
import { publishCollection } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";

export const useDeployMutation = () => {
  
  return useMutation({
    mutationFn: publishCollection,
    onSuccess: () => {
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
