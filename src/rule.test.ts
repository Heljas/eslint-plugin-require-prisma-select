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

ruleTester.run(requirePrismaSelect, rule, {
  valid: [validDataSet],
  invalid: [
    getErrorTest({
      error: RuleError.MissingQueryArgument,
      amount: 5
    }),
    getErrorTest({
      error: RuleError.MissingSelectProperty,
      amount: 11
    })
  ]
});

function getErrorTest({ error, amount }: { error: RuleError; amount: number }) {
  const code = readFileSync(path.join(fixturesDir, `/${error}.data.ts`), {
    encoding: "utf-8"
  });
  const output = readFileSync(path.join(fixturesDir, `/${error}.output.ts`), {
    encoding: "utf-8"
  });

  return {
    code,
    output,
    errors: Array.from({ length: amount }, () => ({
      messageId: error
    }))
  };
}
