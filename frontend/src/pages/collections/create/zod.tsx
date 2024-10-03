import { z } from "zod";

export const collectionSchema = z.object({
  collectionImage: z.any().optional(),
  collectionName: z.string().min(1, "Название коллекции обязательно"),
  collectionDescription: z.string().min(1, "Описание коллекции обязательно"),

  itemsLimit: z.coerce.number().min(1, "Лимит предметов должен быть больше 0"),
  itemPrice: z.coerce
    .number()
    .min(0, "Цена предмета должна быть больше или равна 0"),
  links: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one link is required"),

  itemImage: z.any().optional(),
  itemName: z.string().min(1, "Название предмета обязательно"),
  itemDescription: z.string().min(1, "Описание предмета обязательно"),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
