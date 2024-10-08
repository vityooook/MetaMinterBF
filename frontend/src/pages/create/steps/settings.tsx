import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { createCollectionSchema } from "../zod";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "../store";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { useCreateMutation } from "../hooks/useCreateMutation";

export const formSchema = createCollectionSchema.pick({
  itemsLimit: true,
  nftPrice: true,
  startTime: true,
  endTime: true,
});

export type FormData = z.infer<typeof formSchema>;

export const SettingsForm = () => {
  useBack("../");

  const { set: setFormData, reset: resetFormData, formData } = useFormStore();
  const navigate = useNavigate();
  const mb = useMainButton();
  const createCollection = useCreateMutation();

  const form = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        setFormData(data, "finish");
        const nftCollection = await createCollection.mutateAsync({
          ...formData,
          ...data,
        });
        resetFormData();
        navigate(`/collections/${nftCollection._id}`);
      } catch (e) {
        console.log(e);
      }
    },
    [navigate, resetFormData, setFormData]
  );

  const [fromDate, setFromDate] = useState<string>("");

  const today = new Date().toISOString().slice(0, 16);

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
  };

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
          name="nftPrice" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена NFT</FormLabel>
              <FormControl>
                <Input
                  placeholder="Введите цену NFT"
                  type="input"
                  inputMode="decimal"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itemsLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ограничение по количеству предметов</FormLabel>
              <FormControl>
                <Input
                  placeholder="Введите лимит предметов"
                  type="input"
                  pattern="\d*"
                  inputMode="decimal"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                How many items should be available for mint. Leave empty if
                there's no limit
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Date</FormLabel>
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Выберите начальную дату"
                      type="datetime-local"
                      min={today}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleFromDateChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span>–</span>

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Выберите конечную дату"
                      min={fromDate || today} // Disable dates before fromDate
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormItem>
      </form>
    </Form>
  );
};
