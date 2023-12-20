import { afterAll } from "vitest";
import {
  requirePrismaSelect,
  RuleError,
  rule,
  RuleErrorToSuggestion
} from "../../lib/rules/require-prisma-select";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { readFileSync, readdirSync } from "fs";
import path from "path";

RuleTester.afterAll = afterAll;

const fixturesDir = path.join(__dirname, "..", "/fixtures");

export const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: fixturesDir,
    project: "./tsconfig.json"
  }
});

const validUsages = readFileSync(
  path.join(fixturesDir, "valid/valid.data.ts"),
  {
    encoding: "utf-8"
  }
);

ruleTester.run(requirePrismaSelect, rule, {
  valid: [validUsages],
  invalid: [
    ...Object.values(RuleError).flatMap((error) => getErrorTests(error))
  ]
});

function getErrorTests(error: RuleError) {
  const suggestion = RuleErrorToSuggestion[error];

  const incorectUsages = readdirSync(path.join(fixturesDir, error)).filter(
    (path) => path.endsWith(".data.ts")
  );

  return incorectUsages.map((usage) => {
    const usagePath = path.join(fixturesDir, error, usage);
    const code = readFileSync(usagePath, {
      encoding: "utf-8"
    });

    return {
      code,
      output: null,
      errors: [
        {
          messageId: error,
          suggestions: suggestion
            ? [
                {
                  messageId: suggestion,
                  output: readFileSync(
                    usagePath.replace(".data.ts", ".output.ts"),
                    {
                      encoding: "utf-8"
                    }
                  )
                }
              ]
            : []
        }
      ]
    };
  });
}
