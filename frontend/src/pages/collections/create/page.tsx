import { SubmitHandler, useForm } from "react-hook-form";
import { CollectionFormData, collectionSchema } from "./zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "~/components/ui/use-toast";
import { CollectionForm } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCollection } from "~/api/back";

export const CollectionCreate = () => {
  const mutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      toast({
        title: "Коллекция успешно добавлена",
      });
    },
  });

  const handleSubmit: SubmitHandler<CollectionFormData> = async (formData) => {
    mutation.mutate(formData);

    // const hash = newCollection.hash;
    //   const shareLink = `https://t.me/share/url?url=${BOT_URL}/app?startapp=c_${hash}`;
  };

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      collectionName: "",
      collectionDescription: "",
      itemName: "",
      itemDescription: "",
      itemsLimit: 1,
      itemPrice: 0,
      links: [""],
    },
  });

  return (
    <main>
      {/* {creationStep === 1 && (
        <ConfirmationAlert
          collectionImg={collectionImg}
          itemImg={itemImg}
          collectionName={collectionName}
          collectionDescription={collectionDescription}
          itemName={itemName}
          itemPrice={itemPrice}
          itemsLimit={itemsLimit}
          links={links}
          nextStep={sendData}
        />
      )}

      {creationStep === 2 && (
        <CreationAlert
          collectionImg={collectionImg}
          newCollectionCreated={newCollectionCreated}
        />
      )} */}

      <CollectionForm form={form} onSubmit={handleSubmit} />
    </main>
  );
};
