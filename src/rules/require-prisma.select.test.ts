import { RuleTester } from "@typescript-eslint/rule-tester";
import { afterAll } from "vitest";
import {
  RequirePrismaSelectError,
  requirePrismaSelect
} from "./require-prisma-select.rule";
import {
  missingQueryUsages,
  missingSelectUsages,
  validUsages
} from "./require-prisma-select.data";

RuleTester.afterAll = afterAll;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser"
});

ruleTester.run(requirePrismaSelect.name, requirePrismaSelect.rule, {
  valid: validUsages,
  invalid: [
    ...missingSelectUsages.map((code) => ({
      code,
      errors: [{ messageId: RequirePrismaSelectError.MissingSelectProperty }]
    })),
    ...missingQueryUsages.map((code) => ({
      code,
      errors: [{ messageId: RequirePrismaSelectError.MissingQueryArgument }]
    }))
  ]
});
