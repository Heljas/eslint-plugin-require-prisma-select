import { PrismaClient } from "@prisma/client";

(async function missingQueryArgumentUsage() {
  const prisma = new PrismaClient();

  await prisma.user.findFirst();
})();
