import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/database-config";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const datasourceUrl = getDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
