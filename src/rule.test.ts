import { afterAll } from "vitest";
import { RequirePrismaSelectError, requirePrismaSelect } from "./rule";
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

ruleTester.run(requirePrismaSelect.name, requirePrismaSelect.rule, {
  valid: [validDataSet],
  invalid: [
    {
      code: missingSelectPropertyDataSet,
      errors: Array.from({ length: 11 }, () => ({
        messageId: RequirePrismaSelectError.MissingSelectProperty
      }))
    },
    {
      code: missingQueryArgumentDataSet,
      errors: Array.from({ length: 5 }, () => ({
        messageId: RequirePrismaSelectError.MissingQueryArgument
      }))
    }
  ]
});
