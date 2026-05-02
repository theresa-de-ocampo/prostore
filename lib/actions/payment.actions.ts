"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// * Actions
import { getOrderById } from "./order.actions";

// * Helpers
import { formatError } from "../utils";
import { payPal } from "../paypal";

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
