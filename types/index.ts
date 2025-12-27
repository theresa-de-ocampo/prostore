import { z } from "zod";
import { productSchema, cartItemSchema, cartSchema } from "@/lib/validators";

export type Product = z.infer<typeof productSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
