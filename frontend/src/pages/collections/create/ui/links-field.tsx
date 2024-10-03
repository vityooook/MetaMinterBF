import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { CollectionFormData } from "../zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { XIcon } from "lucide-react";

interface LinksFieldProps {
  form: UseFormReturn<CollectionFormData>;
  max?: number;
  label?: string;
}

export const LinksField: React.FC<LinksFieldProps> = ({ form, label, max = 5 }) => {
  const { control, register, setFocus } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore TODO: fix in future
    name: "links",
    rules: {
      maxLength: max,
    },
  });

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (fields.length < max) {
        append("");
        setTimeout(() => {
          setFocus(`links.${index + 1}`);
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`links.${index}`}
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              
              <FormControl>
                <Input
                  type="url"
                  placeholder={`Enter URL ${index + 1}`}
                  className={field.name}
                  {...field}
                  {...register(`links.${index}`)}
                  onKeyDownCapture={(e) => handleKeyPress(e, index)}
                />
              </FormControl>
              <FormMessage />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 text-destructive"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </FormItem>
          )}
        />
      ))}

      <Button
        type="button"
        disabled={fields.length >= max}
        className="bg-card w-full"
        onClick={() => {
          append(""); 
          setFocus(`links.${fields.length}`);
        }}
      >
        Add more
      </Button>
    </div>
  );
};
