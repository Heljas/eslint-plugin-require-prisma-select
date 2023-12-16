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
import { RuleTester } from "@typescript-eslint/rule-tester";
import { readFileSync, readSync } from "fs";

RuleTester.afterAll = afterAll;

export const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json"
  }
});

ruleTester.run(requirePrismaSelect.name, requirePrismaSelect.rule, {
  valid: [
    readFileSync(__dirname + "/test-data.ts", { encoding: "utf-8" }).toString()
  ],
  invalid: [
    // ...missingSelectUsages.map((code) => ({
    //   code,
    //   errors: [{ messageId: RequirePrismaSelectError.MissingSelectProperty }]
    // })),
    // ...missingQueryUsages.map((code) => ({
    //   code,
    //   errors: [{ messageId: RequirePrismaSelectError.MissingQueryArgument }]
    // }))
  ]
});
