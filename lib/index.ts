import { TSESLint } from "@typescript-eslint/utils";
import { requirePrismaSelect, rule } from "./rules/require-prisma-select";

export const rules = {
  [requirePrismaSelect]: rule
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;
