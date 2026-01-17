import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import WebSocket from "ws";

neonConfig.webSocketConstructor = WebSocket;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Connection string must be defined.");
}

const adapter = new PrismaNeon({ connectionString });

export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        }
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        }
      },
      createdAt: {
        compute(product) {
          return product.createdAt.toISOString();
        }
      }
    },
    cart: {
      itemsPrice: {
        needs: { itemsPrice: true },
        compute(cart) {
          return cart.itemsPrice.toString();
        }
      },
      shippingPrice: {
        needs: { shippingPrice: true },
        compute(cart) {
          return cart.shippingPrice.toString();
        }
      },
      taxPrice: {
        needs: { taxPrice: true },
        compute(cart) {
          return cart.taxPrice.toString();
        }
      },
      totalPrice: {
        needs: { totalPrice: true },
        compute(cart) {
          return cart.totalPrice.toString();
        }
      }
    },
    order: {
      itemsPrice: {
        compute(order) {
          return order.itemsPrice.toString();
        }
      },
      shippingPrice: {
        compute(order) {
          return order.shippingPrice.toString();
        }
      },
      taxPrice: {
        compute(order) {
          return order.taxPrice.toString();
        }
      },
      totalPrice: {
        compute(order) {
          return order.totalPrice.toString();
        }
      }
    },
    orderItem: {
      price: {
        compute(order) {
          return order.price.toString();
        }
      }
    }
  }
});
