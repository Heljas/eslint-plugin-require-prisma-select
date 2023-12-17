import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsage() {
  const prisma = new PrismaClient();

  await prisma.user.update({
    where: {
      id: "Test"
    },
    data: {
      name: "Test"
    }
  });
})();
