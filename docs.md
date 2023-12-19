# eslint-plugin-require-prisma-select

Omitting the `select` property during [Prisma](https://github.com/prisma/prisma/) CRUD operations results in fetching all fields for a specified model. This can lead to private information leakage, security vulnerabilities, or complications in executing zero downtime deployments.

`select` property or a whole query argument is missing in cases such as:

```ts
await prisma.user.findFirst({
  where: {
    id: "Test"
  }
});
```

```ts
await prisma.user.findMany();
```

To fix it define the required property:

```ts
await prisma.user.findFirst({
  where: {
    id: "Test"
  },
  select: {
    // Select needed fields
  }
});
```

```ts
await prisma.user.findMany({
  select: {
    // Select needed fields
  }
});
```

The rule also provides the suggestion to add empty `select` property automatically.
