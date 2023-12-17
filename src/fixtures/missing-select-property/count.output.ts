import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsage() {
  const prisma = new PrismaClient();

  await prisma.user.count({
    where: {
      name: "Test"
    },
    select: {}
  });
})();
