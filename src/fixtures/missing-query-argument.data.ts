import { PrismaClient } from "@prisma/client";

(async function missingQueryArgumentUsages() {
  const prisma = new PrismaClient();

  await prisma.user.findFirst();
  await prisma.user.findFirstOrThrow();
  await prisma.user.findMany();
  await prisma.user.count();

  await prisma.$transaction(async (tx) => {
    tx.user.findFirst();
  });
})();
