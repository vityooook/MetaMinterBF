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
import { createCollectionSchema } from "../zod";
import { Textarea } from "~/components/ui/textarea";
import { LinksField } from "../ui/links-field";
import { ImageUploadPreview } from "~/pages/create/ui/image-uploader";
import { useFormStore } from "../store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";

export const formSchema = createCollectionSchema.pick({
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
    mb.show()
      .enable()
      .setText("Continue")
      .on("click", form.handleSubmit(handleSubmit));

    return () => {
      mb.hide().off("click", form.handleSubmit(handleSubmit));
    };
  }, [mb]);

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
                    accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название коллекции</FormLabel>
              <FormControl>
                <Input placeholder="Введите название коллекции" {...field} />
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
              <FormLabel>Описание коллекции</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Введите описание коллекции"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LinksField form={form} label="Links" />
        <Button>next</Button>
      </form>
    </Form>
  );
};
