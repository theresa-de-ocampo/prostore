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

export const prisma = new PrismaClient({ adapter });
