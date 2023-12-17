import { PrismaClient } from "@prisma/client";

(async function missingQueryArgumentUsages() {
  const prisma = new PrismaClient();

  await prisma.user.findFirst({ select: {} });
  await prisma.user.findFirstOrThrow({ select: {} });
  await prisma.user.findMany({ select: {} });
  await prisma.user.count({ select: {} });

  await prisma.$transaction(async (tx) => {
    tx.user.findFirst({ select: {} });
  });
})();
