import { afterAll } from "vitest";
import { requirePrismaSelect, RuleError, rule } from "./rule";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { readFileSync } from "fs";
import path from "path";

RuleTester.afterAll = afterAll;

const fixturesDir = path.join(__dirname, "/fixtures");

export const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: fixturesDir,
    project: "./tsconfig.json"
  }
});

const validDataSet = readFileSync(path.join(fixturesDir, "/valid.data.ts"), {
  encoding: "utf-8"
});

const missingSelectPropertyDataSet = readFileSync(
  path.join(fixturesDir, "/missing-select-property.data.ts"),
  {
    encoding: "utf-8"
  }
);

const missingQueryArgumentDataSet = readFileSync(
  path.join(fixturesDir, "/missing-query-argument.data.ts"),
  {
    encoding: "utf-8"
  }
);

ruleTester.run(requirePrismaSelect, rule, {
  valid: [validDataSet],
  invalid: [
    {
      code: missingSelectPropertyDataSet,
      errors: Array.from({ length: 11 }, () => ({
        messageId: RuleError.MissingSelectProperty
      }))
    },
    {
      code: missingQueryArgumentDataSet,
      errors: Array.from({ length: 5 }, () => ({
        messageId: RuleError.MissingQueryArgument
      }))
    }
  ]
});
