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
import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMainButton } from "@telegram-apps/sdk-react";
import { useBack } from "~/hooks/useBack";
import { EditCollectionFormData, editCollectionSchema } from "../../db/zod";
import { useEditMutation } from "../../hooks/useEditMutation";
import { LinksField } from "~/components/links-field";
import { useParams } from "react-router-dom";
import { useCollectionStore } from "~/db/collectionStore";
import { formatToLocalDateTime } from "~/lib/utils";
import { Switch } from "~/components/ui/switch";

export const CollectionEditPage = () => {
  useBack("../");

  const { collectionId } = useParams();
  const mb = useMainButton();
  const editCollection = useEditMutation();
  const collection = useCollectionStore((state) =>
    state.getCollection(collectionId!)
  );

  const [showAmount, setShowAmount] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const form = useForm<EditCollectionFormData>({
    mode: "onSubmit",
    resolver: zodResolver(editCollectionSchema),
    defaultValues: {
      ...collection,
      startTime: formatToLocalDateTime(collection?.startTime),
      endTime: formatToLocalDateTime(collection?.endTime),
    },
  });

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

  const handleSubmit = useCallback(
    async (data: EditCollectionFormData) => {
      try {
        await editCollection.mutateAsync(data);
      } catch (e) {
        console.log(e);
      }
    },
    [editCollection]
  );

  const [fromDate, setFromDate] = useState<string>("");

  const today = new Date().toISOString().slice(0, 16);

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
  };

  useEffect(() => {
    const onClick = form.handleSubmit(handleSubmit);
    mb.enable().setText("Continue").show().on("click", onClick);

    return () => {
      mb.hide().off("click", onClick);
    };
  }, [mb]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <input type="hidden" {...form.register(`_id`)} />
        <input type="hidden"  {...form.register(`ownerId`)} />
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

        <LinksField form={form} label="Links" />
      </form>
    </Form>
  );
};
