import { TSESLint } from "@typescript-eslint/utils";
import { requirePrismaSelect, rule } from "./rule";

const plugin = {
  [requirePrismaSelect]: rule
} satisfies Record<string, TSESLint.RuleModule<string, Array<unknown>>>;

export default plugin;
