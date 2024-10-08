import { z } from "zod";

export const nftSchema = z.object({
  image: z.string().min(1),
  name: z.string().min(1, "Название предмета обязательно"),
  description: z.string().min(1, "Описание предмета обязательно"),
});

export const createCollectionSchema = z.object({
  image: z.string().min(1),
  name: z.string().min(1, "Название коллекции обязательно"),
  description: z.string().min(1, "Описание коллекции обязательно"),
  itemsLimit: z.coerce.number().optional(),
  nftPrice: z.coerce
    .number()
    .min(0.01, "Цена предмета должна быть больше или равна 0"),
  links: z.array(z.string().url("Invalid URL").optional()).min(0),
  nfts: z.array(nftSchema).min(1, "At least one item is required"), // Require at least one item
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const publishCollectionSchema = z.object({
  id: z.string(),
  address: z.string(),
});

export type CreateCollectionData = z.infer<typeof createCollectionSchema>;
export type PublishCollectionData = z.infer<typeof publishCollectionSchema>;
export type NftData = z.infer<typeof nftSchema>;
