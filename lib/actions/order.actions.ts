"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";

// * Actions
import { getCartCookie, getCart } from "./cart.actions";
import { getUserById } from "./user.actions";

// * Helpers
import { formatError, RedirectableError } from "../utils";
import { orderItemSchema, orderRecord, orderSchema } from "../validators";

export async function createOrder() {
  let response;

  try {
    const session = await auth();

    if (!session) {
      throw new Error("User is not authenticated.");
    }

    const cartCookie = await getCartCookie();

    if (!cartCookie.userId) {
      throw new Error("No user ID.");
    }

    const user = await getUserById(cartCookie.userId);
    const cart = await getCart(cartCookie);

    if (!cart || cart.items.length === 0) {
      throw new RedirectableError("Cart is empty.", "/cart");
    }

    if (!user.address) {
      throw new RedirectableError(
        "No shipping address.",
        "/checkout/shipping-address"
      );
    }

    if (!user.paymentMethod) {
      throw new RedirectableError(
        "No payment method.",
        "/checkout/payment-method"
      );
    }

    const order = orderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    });

    const savedOrderId = await prisma.$transaction(async (tx) => {
      const savedOrder = await tx.order.create({
        data: order
      });

      for (const item of cart.items) {
        const orderItem = orderItemSchema.parse({
          ...item,
          orderId: savedOrder.id
        });

        await tx.orderItem.create({
          data: orderItem
        });
      }

      await tx.cart.update({
        where: {
          id: cart.id
        },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0
        }
      });

      return savedOrder.id;
    });

    if (!savedOrderId) {
      throw new Error("Order was not saved.");
    }

    response = {
      success: true,
      message: "Order was successfully placed",
      redirectTo: `/order/${savedOrderId}`
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    response = {
      success: false,
      message: formatError(error),
      redirectTo:
        error instanceof RedirectableError ? error.redirectTo : undefined
    };
  }

  return response;
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId
    },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  let validatedOrder = undefined;

  if (order) {
    validatedOrder = orderRecord.parse(order);
  }

  return validatedOrder;
}
