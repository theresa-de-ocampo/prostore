"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// * Actions
import { getOrderById, updateOrderToPaid } from "../order.actions";

// * Helpers
import { formatError } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";

export async function getOrders({
  page,
  limit = 10
}: {
  page: number;
  limit?: number;
}) {
  await requireAdmin();

  const data = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: limit,
    skip: (page - 1) * limit,
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  const dataCount = await prisma.order.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  };
}

export async function deleteOrder(orderId: string) {
  let response;

  try {
    await requireAdmin();
    await prisma.order.delete({
      where: {
        id: orderId
      }
    });

    revalidatePath("/admin/orders");

    response = {
      success: true,
      message: "Order was successfully deleted."
    };
  } catch (error) {
    response = {
      success: false,
      message: formatError(error)
    };
  }

  return response;
}

export async function markOrderAsPaid(orderId: string) {
  let response;

  try {
    await requireAdmin();
    await updateOrderToPaid(orderId);

    revalidatePath(`/order/${orderId}`);
    revalidatePath("/admin/orders");

    response = {
      success: true,
      message: "Order was successfully marked as paid."
    };
  } catch (error) {
    response = {
      success: false,
      message: formatError(error)
    };
  }

  return response;
}

export async function markOrderAsDelivered(orderId: string) {
  let response;

  try {
    await requireAdmin();
    const order = await getOrderById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (!order.isPaid) {
      throw new Error("Order is not paid.");
    }

    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        isDelivered: true,
        deliveredAt: new Date()
      }
    });

    revalidatePath(`/order/${orderId}`);
    revalidatePath("/admin/orders");

    response = {
      success: true,
      message: "Order was successfully marked as delivered."
    };
  } catch (error) {
    response = {
      success: false,
      message: formatError(error)
    };
  }

  return response;
}
