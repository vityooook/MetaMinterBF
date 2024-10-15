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
import { ImageUploadPreview } from "~/components/image-uploader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "../store";
import { z } from "zod";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";

export const formSchema = collectionSchema.pick({
  nfts: true,
});

export type FormData = z.infer<typeof formSchema>;

export const NftForm = () => {
  useBack("../");
  const { set: setFormData, formData } = useFormStore();
  const navigate = useNavigate();
  const mb = useMainButton();

  const form = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      nfts: formData.nfts,
    },
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      setFormData(data, "settings");
      navigate("/collections/create/settings");
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

  console.log(form.getValues());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nfts.0.image"
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
          name="nfts.0.name" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFT Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter NFT name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nfts.0.description" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFT Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Enter NFT description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
