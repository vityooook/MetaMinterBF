import { z } from "zod";

export const itemSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(1, "Название предмета обязательно"),
  description: z.string().min(1, "Описание предмета обязательно"),
  price: z.coerce
    .number()
    .min(0, "Цена предмета должна быть больше или равна 0"),
});

export const collectionSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(1, "Название коллекции обязательно"),
  description: z.string().min(1, "Описание коллекции обязательно"),
  itemsLimit: z.coerce
    .number()
    .min(1, "Лимит предметов должен быть больше 0")
    .optional(),
  links: z.array(z.string().url("Invalid URL")).optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"), // Require at least one item
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;
