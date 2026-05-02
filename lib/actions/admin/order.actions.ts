"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

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
