"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { cartItemSchema } from "../validators";

export async function addToCart(data: CartItem) {
  let response;

  try {
    const cart = await getCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId }
    });

    console.log({
      item,
      product
    });

    response = { success: true, message: `${data.name} added to cart.` };
  } catch (error) {
    response = { success: false, message: formatError(error) };
  }

  return response;
}

export async function getCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Cart session not found.");
  }

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId }
  });

  return convertToPlainObject(cart);
}
