# eslint-plugin-require-prisma-select

By default, if `select` property is omitted while using [Prisma](https://github.com/prisma/prisma/) client, it returns all table columns. It can lead to the leaking of private information, create a security vulnerability, or prevent no-downtime updates.

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
