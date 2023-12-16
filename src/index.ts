import { TSESLint } from "@typescript-eslint/utils";
import { requirePrismaSelect } from "./rule";

export const rules = {
  [requirePrismaSelect.name]: requirePrismaSelect.rule
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;
