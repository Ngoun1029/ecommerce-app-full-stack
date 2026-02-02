import { PrismaClient } from "../src/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter: adapter,
  });
};

declare const globalThis: {
  prismaClientSingleton: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaClientSingleton || prismaClientSingleton();

export default prisma 
if (process.env.NODE_ENV !== "production") globalThis.prismaClientSingleton = prisma;