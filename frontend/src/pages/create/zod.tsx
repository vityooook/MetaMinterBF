import { z } from "zod";

export const nftSchema = z.object({
  image: z.string().min(1, "Please upload collection image"),
  name: z.string().min(1, "NFT name is required"),
  description: z.string().min(1, "Description is required"),
});

export const createCollectionSchema = z.object({
  image: z.string().min(1, "Please upload collection image"),
  name: z.string().min(1, "Collection name is required"),
  description: z.string().min(1, "Collection description is required"),
  itemsLimit: z.coerce.number().optional(),
  nftPrice: z.coerce
    .number()
    .min(0.01, "Цена предмета должна быть больше или равна 0"),
  links: z.array(z.string().url("Invalid Url. Enter url with https://")),
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
