import { PrismaClient } from "@prisma/client";

(async function missingQueryArgumentUsage() {
  const prisma = new PrismaClient();

  await prisma.$transaction(async (tx) => {
    tx.user.findFirst({ select: {} });
  });
})();
