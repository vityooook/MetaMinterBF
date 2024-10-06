import { useMutation } from "@tanstack/react-query";
import { generateCollectionPayload } from "~/api/backend";
import { toast } from "~/components/ui/use-toast.ts";

export const usePublishMutation = () => {
  return useMutation({
    mutationFn: generateCollectionPayload,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish collection",
        variant: "destructive",
      });
    },
  });
};
