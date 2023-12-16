import { PrismaClient } from "@prisma/client";

async function test() {
  const prisma = new PrismaClient();

  await prisma.user.findUnique({
    where: {
      id: "Test"
    }
  });

  await prisma.user.findFirst();
}
