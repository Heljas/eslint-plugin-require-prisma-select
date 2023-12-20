import { PrismaClient } from "@prisma/client";

(async function incorrectQueryValueUsage() {
  const prisma = new PrismaClient();

  await prisma.user.findFirst({
    select: {
      name: true,
      articles: true
    }
  });
})();
