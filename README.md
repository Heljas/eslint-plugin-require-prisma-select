# eslint-plugin-require-prisma-select

Require `select` property in a query argument while using [Prisma](https://github.com/prisma/prisma/).

## Installation

You'll first need to install [ESLint](https://eslint.org/docs/latest/user-guide/getting-started):

```sh
# npm
npm install eslint --save-dev

# yarn
yarn add eslint --dev

# pnpm
pnpm add eslint -D
```

Next, install `eslint-plugin-require-prisma-select`:

```sh
# npm
npm install eslint-plugin-require-prisma-select --save-dev

# yarn
yarn add eslint-plugin-require-prisma-select --dev

# pnpm
pnpm add eslint-plugin-require-prisma-select -D
```

## Usage

Add `require-prisma-select` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["require-prisma-select"]
}
```

Then add the rule to the rules section of your `.eslintrc`:

```json
{
  "rules": {
    "require-prisma-select/require-prisma-select": "error"
  }
}
```

If the missing property is detected, the rule also provides a suggestion to add it.

## Why

By default, if `select` property is omitted while using [Prisma](https://github.com/prisma/prisma/) client, it returns all table columns. It can lead to the leaking of private information, create a security vulnerability, or prevent no-downtime updates. Unfortunately, `Prisma` doesn't provide any way to hide or mark selected fields as private, which would prevent querying them unless explicitly stated. There is also no option to generate `select` property as required in `Prisma` types.

One option to solve it is to create a script to override types and make `select` property required, but it would need to run after every regeneration of types. That's why the custom eslint rule is a better way to handle it.

## How it works

The rule parses AST and analyzes Typescript types to detect Prisma client usages. If a method accepts argument with an optional `select` property, the rule ensures it's defined.

## License

[MIT](https://github.com/Heljas/eslint-plugin-require-prisma-select/blob/main/LICENSE.md)
