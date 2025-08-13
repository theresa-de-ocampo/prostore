"use server";

import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

export async function getLatestProducts() {
  const client = new PrismaClient();
  const data = await client.product.findMany({
    take: LATEST_PRODUCTS_LIMIT
  });

  return convertToPlainObject(data);
}
