import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { AdornedInput, Input } from "~/components/ui/input";
import { FormData } from "../steps/collection";

interface LinksFieldProps {
  form: UseFormReturn<FormData>;
  max?: number;
  label?: string;
}

export const LinksField: React.FC<LinksFieldProps> = ({ form, label }) => {
  const { control } = form;

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>

      <FormField
        control={control}
        name="links.0"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://twitter.com/"
                urlPattern={/https?:\/\/(www\.)?twitter\.com\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.1"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://discord.gg/"
                urlPattern={/https?:\/\/(www\.)?discord\.g\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.2"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://t.me/"
                urlPattern={/https?:\/\/(www\.)?t\.me\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.3"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://instagram.com/"
                urlPattern={/https?:\/\/(www\.)?instagram\.com\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.4"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://youtube.com/"
                urlPattern={/https?:\/\/(www\.)?youtube\.com\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.5"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://tiktok.com/"
                urlPattern={/https?:\/\/(www\.)?tiktok\.com\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.6"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <AdornedInput
                {...field}
                startAdornment="https://vk.com/"
                urlPattern={/https?:\/\/(www\.)?vk\.com\//}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.7"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Any Link" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.8"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Any Link" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="links.9"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Any Link" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
