/**
 * Generic Prisma find helper with optional relations
 * @param modelName - Prisma model name as string (e.g., "users")
 * @param value - value to search for
 * @param key - field to search by (default: "id")
 * @param include - relations to include
 * @param skipValidation - skip throwing if not found
 */
import { prisma } from "./prisma";

export async function findOneWithRelations(
  modelName: keyof typeof prisma,
  value: any,
  key: string = "id",
  include?: object,
  skipValidation: boolean = false
): Promise<any | null | undefined> {
  // @ts-ignore
  const entity = await prisma[modelName].findFirst({
    where: { [key]: value },
    include,
  });

  if (!entity && !skipValidation) {
    throw new Error("Entity not found");
  }

  return entity;
}