import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["vegetables", "fruits", "grains", "dairy"]),
  price: z.number().positive(),
  quantityAvailable: z.number().int().nonnegative(),
  imageUrl: z.url(),
  harvestDate: z.preprocess(
    (v) => (v ? new Date(v as string) : undefined),
    z.date()
  ),
  expiryDate: z.preprocess(
    (v) => (v ? new Date(v as string) : undefined),
    z.date()
  ),
});

export const updateProductSchema = createProductSchema.partial();
