import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsage() {
  const prisma = new PrismaClient();

  await prisma.user.findFirstOrThrow({
    where: {
      id: "Test"
    },
    select: {}
  });
})();
