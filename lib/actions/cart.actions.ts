"use server";

import { cookies } from "next/headers";
import { Cart, CartItem } from "@/types";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, round } from "../utils";
import { cartItemSchema, cartSchema } from "../validators";
import { revalidatePath } from "next/cache";

async function getCartCookie() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Cart session not found.");
  }

  const session = await auth();
  const userId = session?.user?.id;

  return {
    sessionCartId,
    userId
  };
}

function calculatePrices(items: CartItem[]) {
  const itemsPrice = round(
    items.reduce((total, item) => {
      return (total += parseFloat(item.price) * item.quantity);
    }, 0)
  );
  const shippingPrice = round(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round(0.15 * itemsPrice);
  const totalPrice = round(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  };
}

async function createCart(cart: Cart) {
  const validatedCart = cartSchema.parse(cart);

  await prisma.cart.create({
    data: validatedCart
  });
}

export async function addToCart(data: CartItem) {
  let response;

  try {
    const cartCookie = await getCartCookie();
    const cart = await getCart(cartCookie);

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId }
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!cart) {
      await createCart({
        items: [item],
        ...calculatePrices([item]),
        ...cartCookie
      });
    }

    revalidatePath(`/product/${product.slug}`);

    response = { success: true, message: `${data.name} added to cart.` };
  } catch (error) {
    response = { success: false, message: formatError(error) };
  }

  return response;
}

export async function getCart({
  sessionCartId,
  userId
}: {
  sessionCartId: string;
  userId: string | undefined;
}) {
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId }
  });

  return convertToPlainObject(cart);
}
