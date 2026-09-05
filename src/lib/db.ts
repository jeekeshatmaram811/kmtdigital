import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/generated/prisma/client";

neonConfig.webSocketConstructor = ws;

declare global {
  var __prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.__prisma) {
    const connectionString = process.env.POSTGRES_PRISMA_URL;
    if (!connectionString) {
      throw new Error("POSTGRES_PRISMA_URL must be set");
    }
    const adapter = new PrismaNeon({ connectionString });
    global.__prisma = new PrismaClient({ adapter });
  }
  return global.__prisma;
}
