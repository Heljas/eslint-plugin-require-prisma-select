export const validUsages = [
  `await prisma.user.findUnique({
      where: {
        id: "Test"
      },
      select: {}
    });`,

  `await prisma.user.findUniqueOrThrow({
      where: {
        id: "Test"
      },
      select: {}
    });`,

  `await prisma.user.findFirst({
      where: {
        name: "Test"
      },
      select: {}
    });`,

  `await prisma.user.findFirstOrThrow({
      where: {
        name: "Test"
      },
      select: {}
    });`,

  `await prisma.user.findMany({
      select: {}
    });`,

  `await prisma.user.create({
      data: {
        name: "Test"
      },
      select: {}
    });`,

  `await prisma.user.update({
      where: {
        id: "Test"
      },
      data: {
        name: "Test"
      },
      select: {}
    });`,

  `await prisma.user.upsert({
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
    });`,

  `await prisma.user.delete({
      where: {
        id: "Test"
      },
      select: {}
    });`,

  `await prisma.user.count({
      where: {
        name: "Test"
      },
      select: {}
    });`
];

export const missingSelectUsages = [
  `await prisma.user.findUnique({
      where: {
        id: "Test"
      }
    });`,

  `await prisma.user.findUniqueOrThrow({
      where: {
        id: "Test"
      }
    });`,

  `await prisma.user.findFirst({
      where: {
        name: "Test"
      }
    });`,

  `await prisma.user.findFirstOrThrow({
      where: {
        name: "Test"
      }
    });`,

  `await prisma.user.findMany({});`,

  `await prisma.user.create({
      data: {
        name: "Test"
      }
    });`,

  `await prisma.user.update({
      where: {
        id: "Test"
      },
      data: {
        name: "Test"
      }
    });`,

  `await prisma.user.upsert({
      where: {
        id: "Test"
      },
      create: {
        name: "Test"
      },
      update: {
        name: "Test"
      }
    });`,

  `await prisma.user.delete({
      where: {
        id: "Test"
      }
    });`,

  `await prisma.user.count({
      where: {
        name: "Test"
      }
    });`
];

export const missingQueryUsages = [
  `await prisma.user.findFirst();`,
  `await prisma.user.findFirstOrThrow();`,
  `await prisma.user.findMany();`,
  `await prisma.user.count();`
];
