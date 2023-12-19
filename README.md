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

Then, add the rule to the rules section of your `.eslintrc`:

```json
{
  "rules": {
    "require-prisma-select/require-prisma-select": "error"
  }
}
```

If the missing property is detected, the rule also provides a suggestion to add it.

## Why

Omitting the `select` property during [Prisma](https://github.com/prisma/prisma/) CRUD operations results in fetching all fields for a specified model. This can lead to private information leakage, security vulnerabilities, or complications in executing zero downtime deployments. Unfortunately, `Prisma` lacks a mechanism to hide or mark selected fields as private, preventing them from being queried unless explicitly specified. Additionally, there's no option to generate a `select` property as required in `Prisma` types.

A potential solution involves creating a script to override generated types and make the select property required. However, this script would need to run after every types regeneration. The custom ESLint rule offers a more efficient approach to address this issue.

## How it works

The rule parses the Abstract Syntax Tree (AST) and analyzes Typescript types to detect Prisma client usages. If a method accepts an argument with an optional `select` property, this rule ensures it's defined.

## License

[MIT](https://github.com/Heljas/eslint-plugin-require-prisma-select/blob/main/LICENSE.md)
