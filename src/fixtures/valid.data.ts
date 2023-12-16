import { PrismaClient } from "@prisma/client";

(async function validUsages() {
  const prisma = new PrismaClient();

  await prisma.user.findUnique({
    where: {
      id: "Test"
    },
    select: {
      id: true
    }
  });

  await prisma.user.findUniqueOrThrow({
    where: {
      id: "Test"
    },
    select: {}
  });

  await prisma.user.findFirst({
    where: {
      name: "Test"
    },
    select: {}
  });

  await prisma.user.findFirstOrThrow({
    where: {
      name: "Test"
    },
    select: {}
  });

  await prisma.user.findMany({
    select: {}
  });

  await prisma.user.create({
    data: {
      name: "Test"
    },
    select: {}
  });

  await prisma.user.update({
    where: {
      id: "Test"
    },
    data: {
      name: "Test"
    },
    select: {}
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
    },
    select: {}
  });

  await prisma.user.delete({
    where: {
      id: "Test"
    },
    select: {}
  });

  await prisma.user.count({
    where: {
      name: "Test"
    },
    select: {}
  });

  await prisma.$transaction(async (tx) => {
    tx.user.findUnique({
      where: {
        id: "Test"
      },
      select: {
        id: true
      }
    });
  });

  // Usages with no select property
  await prisma.user.deleteMany();
  await prisma.user.deleteMany({
    where: {
      name: "Test"
    }
  });

  await prisma.user.updateMany({
    where: {
      name: "Test"
    },
    data: {
      name: "Test"
    }
  });

  await prisma.user.groupBy({
    where: {
      name: "Test"
    },
    by: ["name"]
  });

  await prisma.user.aggregate({
    where: {
      name: "Test"
    }
  });
})();
