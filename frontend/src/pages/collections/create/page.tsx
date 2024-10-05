import { SubmitHandler, useForm } from "react-hook-form";
import { CollectionFormData, collectionSchema } from "./zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import { CollectionForm } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollection } from "~/api/backend";
import { useCollectionStore } from "~/db/collectionStore";
import { useNavigate } from "react-router-dom";
import { useBack } from "~/hooks/useBack";
import { useEffect } from "react";
import { useMainButton } from "@telegram-apps/sdk-react";

export const CollectionCreatePage = () => {
  useBack("/");

  const { addCollection } = useCollectionStore();
  const navigate = useNavigate();
  const mb = useMainButton();

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
      dateFrom: "",
      dateTo: "",
    },
  });

  useEffect(() => {
    mb.show()
      .enable()
      .setText("Continue")
      .on("click", form.handleSubmit(handleSubmit));

    return () => {
      mb.hide().off("click", form.handleSubmit(handleSubmit));
    };
  }, [mb]);

  return (
    <main>
      <CollectionForm form={form} onSubmit={handleSubmit} />
    </main>
  );
};
