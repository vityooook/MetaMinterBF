import { UseFormReturn } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CollectionFormData } from "../zod";
import { Textarea } from "~/components/ui/textarea";
import { LinksField } from "./links-field";
import { ImageUploadPreview } from "~/components/ui/image-uploader";
import { useState } from "react";

interface CollectionFormProps {
  formData?: CollectionFormData; // Optional prop for editing
  isPending?: boolean;
  isEditing?: boolean;
  form: UseFormReturn<CollectionFormData>;
  onSubmit: (data: CollectionFormData) => void; // Submission handler
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  onSubmit,
  form,
}) => {
  const [fromDate, setFromDate] = useState<string>("");

  const today = new Date().toISOString().slice(0, 16);

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <h2 className="font-bold text-center pt-8">NFT Info</h2>

        <FormField
          control={form.control}
          name="items.0.image"
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
          name="items.0.name" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название предмета</FormLabel>
              <FormControl>
                <Input placeholder="Введите название предмета" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items.0.description" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание предмета</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Введите описание предмета"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items.0.price" // Update to handle only one item
          render={({ field }) => (
            <FormItem>
              <FormLabel>Цена предмета</FormLabel>
              <FormControl>
                <Input
                  placeholder="Введите цену предмета"
                  type="number"
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
                  type="number"
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
              name="dateFrom"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Выберите начальную дату"
                      type="datetime-local"
                      min={today} // Disable past dates
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // Update react-hook-form
                        handleFromDateChange(e.target.value); // Update fromDate state
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
              name="dateTo"
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

        <footer className="pt-8">
          <Button type="submit" className="w-full" size="lg">
            Добавить коллекцию
          </Button>
        </footer>
      </form>
    </Form>
  );
};
