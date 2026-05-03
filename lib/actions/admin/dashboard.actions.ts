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

  const totalSalesRaw = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      isPaid: true
    }
  });

  const totalSales = Number(totalSalesRaw._sum.totalPrice);

  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    SELECT
      to_char("createdAt", 'YY/MM') AS "month",
      SUM("totalPrice") AS "totalSales"
    FROM
      "Order"
    GROUP BY
      to_char("createdAt", 'YY/MM')
    ORDER BY
      "month"
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
