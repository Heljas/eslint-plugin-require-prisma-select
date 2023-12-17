import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsage() {
  const prisma = new PrismaClient();

  await prisma.$transaction(async (tx) => {
    tx.user.findUnique({
      where: {
        id: "Test"
      },
      select: {}
    });
  });
})();
