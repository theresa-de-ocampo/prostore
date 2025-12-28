"use server";

import { CartItem } from "@/types";

export async function addToCart(data: CartItem) {
  return { success: true, message: `${data.name} added to cart.` };
}
