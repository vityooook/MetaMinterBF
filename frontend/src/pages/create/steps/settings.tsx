
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
import { useCallback, useEffect, useState, ChangeEvent } from "react";
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
              <FormLabel>NFT Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter NFT price"
                  type="input"
                  inputMode="decimal"
                  {...field}

                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value;
                    const decimalRegex =
                      /^[+-]?([0-9]+([.,][0-9]*)?|[.][0-9]+)$/;

                    if (decimalRegex.test(value) || value === "") {
                      field.onChange(value.replace(/,/g, "."));
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Please enter the price per copy.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="itemsLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter amount"
                  type="input"
                  pattern="\d*"
                  inputMode="decimal"
                  {...field}
                  
                />
              </FormControl>
              <FormDescription>
                Specify the number of NFTs available for purchase
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="gap-2">
          <FormLabel>Timer</FormLabel>
          <div className="flex gap-2 items-center">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
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
                      min={fromDate || today} // Disable dates before fromDate
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormDescription>
            Specify when the sale of the collection will start and end
          </FormDescription>
        </FormItem>
      </form>
    </Form>
  );
};
