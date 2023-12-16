import { TSESLint } from "@typescript-eslint/utils";
import { requirePrismaSelect, rule } from "./rule";

export const rules = {
  [requirePrismaSelect]: rule
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;
