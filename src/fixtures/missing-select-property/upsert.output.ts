import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsage() {
  const prisma = new PrismaClient();

  await prisma.user.upsert({
    where: {
      id: "Test"
    },
    create: {
      name: "Test"
    },
    update: {
      name: "Test"
    },
    select: {}
  });
})();
