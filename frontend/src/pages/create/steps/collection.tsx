import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { collectionSchema } from "../../../db/zod";
import { Textarea } from "~/components/ui/textarea";
import { LinksField } from "../../../components/links-field";
import { ImageUploadPreview } from "~/components/image-uploader";
import { useFormStore } from "../store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";

export const formSchema = collectionSchema.pick({
  image: true,
  name: true,
  description: true,
  links: true,
});

export type FormData = z.infer<typeof formSchema>;

export const CollectionForm = () => {
  useBack("/");
  const { set: setFormData, formData } = useFormStore();
  const navigate = useNavigate();
  const mb = useMainButton();

  const form = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: formData.image,
      name: formData.name,
      description: formData.description,
      links: [],
    },
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      setFormData(data, "nft");
      navigate("/collections/create/nft");
    },
    [navigate, setFormData]
  );

  useEffect(() => {
    const onClick = form.handleSubmit(handleSubmit);
    mb.show().enable().setText("Continue").on("click", onClick);

    return () => {
      mb.hide().off("click", onClick);
    };
  }, [mb]);

  console.log(FormData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <div className="flex flex-col items-center gap-2">
                <FormControl>
                  <ImageUploadPreview
                    value={value}
                    onChange={onChange}
                    accept=".jpg,.jpeg,.png,.webp,.svg"
                    description="Optimal dimensions: 512x512"
                    resolution={512}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Collection name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Enter Collection description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LinksField form={form} label="Links" />
      </form>
    </Form>
  );
};
