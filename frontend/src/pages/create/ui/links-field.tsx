import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { XIcon } from "lucide-react";
import { getPlatformIcon } from "~/lib/social-utils";
import { FormData } from "../steps/collection";

interface LinksFieldProps {
  form: UseFormReturn<FormData>;
  max?: number;
  label?: string;
}

export const LinksField: React.FC<LinksFieldProps> = ({
  form,
  label,
  max = 10,
}) => {
  const { control, register, setFocus } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    //@ts-ignore
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
        append("" as any);
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
                <div className="flex items-center relative">
                  {/* Input for URL */}
                  <Input
                    type="url"
                    placeholder={`Enter URL ${index + 1}`}
                    className={`${field.name} pl-10`}
                    {...field}
                    {...register(`links.${index}`)}
                    onKeyDownCapture={(e) => handleKeyPress(e, index)}
                  />

                  {/* Platform Icon */}
                  <div className="ml-2 absolute top-3 left-1">{getPlatformIcon(field.value, 4)}</div>
                </div>
              </FormControl>

              <FormMessage />

              {/* Remove Button */}
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

      {/* Add more Button */}
      <Button
        type="button"
        disabled={fields.length >= max}
        className="bg-card w-full"
        onClick={() => {
          append("" as any);
          setFocus(`links.${fields.length}`);
        }}
      >
        Add more
      </Button>
    </div>
  );
};
