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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Изображение коллекции</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  value={value?.fileName}
                  onChange={(event: any) => {
                    onChange(event.target.files[0]);
                  }}
                />
              </FormControl>
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

        <FormField
          control={form.control}
          name="items.0.image" // Update to handle only one item
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Изображение коллекции</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...field}
                  value={value?.fileName}
                  onChange={(event: any) => {
                    onChange(event.target.files[0]);
                  }}
                />
              </FormControl>
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

        <Button type="submit" className="w-full">
          Добавить коллекцию
        </Button>
      </form>
    </Form>
  );
};
