"use server";

import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {
  return await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({ where: { slug } });
}
