import { PrismaClient } from "@prisma/client";

(async function missingSelectPropertyUsages() {
  const prisma = new PrismaClient();

  await prisma.user.findUnique({
    where: {
      id: "Test"
    }
  });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: "Test"
    }
  });

  await prisma.user.findFirst({
    where: {
      name: "Test"
    }
  });

  await prisma.user.findFirstOrThrow({
    where: {
      name: "Test"
    }
  });

  await prisma.user.findMany({});

  await prisma.user.create({
    data: {
      name: "Test"
    }
  });

  await prisma.user.update({
    where: {
      id: "Test"
    },
    data: {
      name: "Test"
    }
  });

  await prisma.user.upsert({
    where: {
      id: "Test"
    },
    create: {
      name: "Test"
    },
    update: {
      name: "Test"
    }
  });

  await prisma.user.delete({
    where: {
      id: "Test"
    }
  });

  await prisma.user.count({
    where: {
      name: "Test"
    }
  });

  await prisma.$transaction(async (tx) => {
    tx.user.findUnique({
      where: {
        id: "Test"
      }
    });
  });
})();
