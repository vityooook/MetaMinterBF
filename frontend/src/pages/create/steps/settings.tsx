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
import { collectionSchema } from "../../../db/zod";
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStore } from "../store";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { useCreateMutation } from "../../../hooks/useCreateMutation";
import { Switch } from "~/components/ui/switch";

export const formSchema = collectionSchema.pick({
  itemsLimit: true,
  nftPrice: true,
  startTime: true,
  endTime: true,
});

export type FormData = z.infer<typeof formSchema>;

export const SettingsForm = () => {
  useBack("../");

  const { formData } = useFormStore();

  const mb = useMainButton();
  const createCollection = useCreateMutation();

  const form = useForm<FormData>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const handleSubmit = useCallback(
    async (data: FormData) => {
      if (!createCollection.isPending) {
        try {
          await createCollection.mutateAsync({
            ...formData,
            ...data,
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    [createCollection]
  );

  const [fromDate, setFromDate] = useState<string>("");

  const today = new Date().toISOString().slice(0, 16);

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
  };

  useEffect(() => {
    const onClick = form.handleSubmit(handleSubmit);
    mb.enable().setText("Create Collection").show().on("click", onClick);

    return () => {
      mb.hide().off("click", onClick);
    };
  }, [mb]);

  const [showAmount, setShowAmount] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    // Check if itemsLimit exists and set showAmount accordingly
    if (form.getValues("itemsLimit")) {
      setShowAmount(true);
    }

    // Check if startTime or endTime exists and set showTimer accordingly
    if (form.getValues("startTime") || form.getValues("endTime")) {
      setShowTimer(true);
    }
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nftPrice"
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

        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Limited amount</FormLabel>
            <Switch
              checked={showAmount}
              onCheckedChange={(checked) => {
                setShowAmount(checked);
                if (!checked) {
                  form.setValue("itemsLimit", undefined);
                }
              }}
            />
          </div>
          {showAmount && (
            <FormField
              control={form.control}
              name="itemsLimit"
              render={({ field }) => (
                <FormItem>
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
          )}
        </FormItem>

        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>Set timer</FormLabel>
            <Switch
              checked={showTimer}
              onCheckedChange={(checked) => {
                setShowTimer(checked);
                if (!checked) {
                  form.setValue("startTime", undefined);
                  form.setValue("endTime", undefined);
                }
              }}
            />
          </div>
          {showTimer && (
            <FormItem className="gap-2">
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
                          min={fromDate || today}
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
          )}
        </FormItem>
      </form>
    </Form>
  );
};
