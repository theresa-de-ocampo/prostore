"use server";

import { prisma } from "@/db/prisma";
import type { Prisma } from "@prisma/client";

export async function getExecutiveSummary() {
  const ordersCount = await prisma.order.count();
  const productsCount = await prisma.product.count();
  const customersCount = await prisma.user.count({
    where: {
      role: "customer"
    }
  });

  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true }
  });

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    SELECT
      to_char("createdAt", "MM/YY") AS "month"
      SUM("totalPrice") AS "totalSales"
    FROM
      "Order"
    GROUP BY
      to_char("createdAt", "MM/YY")
  `;

  const salesData = salesDataRaw.map((record) => ({
    month: record.month,
    totalSales: Number(record.totalSales)
  }));

  const latestSales = await prisma.order.findMany({
    where: {
      isPaid: true
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
    take: 6
  });

  return {
    ordersCount,
    productsCount,
    customersCount,
    totalSales,
    salesData,
    latestSales
  };
}
