import { prisma } from "./prisma";



export async function findUnique(email: string){
  return prisma.users.findUnique({
    where: { email },
  });
}
