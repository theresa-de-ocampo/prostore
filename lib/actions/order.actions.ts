"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// * Actions
import { getCartCookie, getCart } from "./cart.actions";
import { getUserById } from "./user.actions";

// * Helpers
import { formatError, RedirectableError } from "../utils";
import { orderItemSchema, orderRecord, orderSchema } from "../validators";
import { payPal } from "../paypal";

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

export async function createPayPalOrder(orderId: string) {
  let response;

  try {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    const payPalOrder = await payPal.createOrder(order.totalPrice);

    await prisma.order.update({
      where: {
        id: order.id
      },
      data: {
        paymentResult: {
          id: payPalOrder.id,
          status: "",
          email_address: "",
          pricePaid: 0
        }
      }
    });

    response = {
      success: true,
      message: "PayPal order created successfully.",
      data: payPalOrder.id
    };
  } catch (error) {
    response = { success: false, message: formatError(error) };
  }

  return response;
}

export async function approvePayPalOrder(orderId: string) {
  let response;

  try {
    const order = await getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (!order?.paymentResult?.id) {
      throw new Error("PayPal Order not found.");
    }

    if (order.isPaid) {
      throw new Error("Order is already paid");
    }

    const payPalOrderId = order.paymentResult.id;
    const capturedPayment = await payPal.capturePayment(payPalOrderId);

    if (capturedPayment?.id !== payPalOrderId) {
      throw new Error("Error in PayPal Payment");
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: {
            id: item.productId
          },
          data: {
            stock: { increment: -item.quantity }
          }
        });
      }

      return await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: capturedPayment.id,
            status: capturedPayment.status,
            email: capturedPayment.payer.email_address,
            pricePaid:
              capturedPayment.purchase_units[0]?.payments?.captures[0]?.amount
                ?.value
          }
        }
      });
    });

    if (!updatedOrder) {
      throw new Error("Order was not set to paid.");
    }

    revalidatePath(`/order/${orderId}`);

    response = { success: true, message: "Your order has been paid." };
  } catch (error) {
    response = { success: false, message: formatError(error) };
  }

  return response;
}
