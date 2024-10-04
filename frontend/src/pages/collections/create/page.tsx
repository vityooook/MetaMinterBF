import { SubmitHandler, useForm } from "react-hook-form";
import { CollectionFormData, collectionSchema } from "./zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import { CollectionForm } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollection } from "~/api/back";
import { useCollectionStore } from "~/db/collectionStore";
import { useNavigate } from "react-router-dom";

export const CollectionCreate = () => {
  const { addCollection } = useCollectionStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createCollection,
    onSuccess: (newCollection) => {
      toast({
        title: "Коллекция успешно добавлена",
      });
      addCollection(newCollection);
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Ошибка при добавлении коллекции",
        variant: "destructive",
      });
    },
  });

  const handleSubmit: SubmitHandler<CollectionFormData> = async (formData) => {
    mutation.mutate(formData);
  };

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
      items: [],
      itemsLimit: 1,
      links: [],
    },
  });

  return (
    <main>
      <CollectionForm form={form} onSubmit={handleSubmit} />
    </main>
  );
};
