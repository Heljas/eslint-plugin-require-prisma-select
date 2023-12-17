import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

export const requirePrismaSelect = "require-prisma-select";

export const RuleError = {
  MissingQueryArgument: "missing-query-argument",
  MissingSelectProperty: "missing-select-property"
} as const;
export type RuleError = (typeof RuleError)[keyof typeof RuleError];

export const RuleSuggestion = {
  AddQueryArgument: "add-query-argument",
  AddSelectProperty: "add-select-property"
} as const;
export type RuleSuggestion =
  (typeof RuleSuggestion)[keyof typeof RuleSuggestion];

export const RuleErrorToSuggestion = {
  [RuleError.MissingQueryArgument]: RuleSuggestion.AddQueryArgument,
  [RuleError.MissingSelectProperty]: RuleSuggestion.AddSelectProperty
} as const;

const prismaClientProperties = [
  "$executeRaw",
  "$executeRawUnsafe",
  "$queryRaw",
  "$queryRawUnsafe"
];

const selectProperty = "select";

export const rule = ESLintUtils.RuleCreator.withoutDocs({
  create: (context) => ({
    CallExpression: (node) => {
      if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

      const object = node.callee.object;
      if (object.type !== AST_NODE_TYPES.MemberExpression) return;

      const nestedObject = object.object;
      if (nestedObject.type !== AST_NODE_TYPES.Identifier) return;

      const services = ESLintUtils.getParserServices(context);

      const objectType = services.getTypeAtLocation(nestedObject);

      if (!tsutils.isTypeFlagSet(objectType, ts.TypeFlags.Object)) return;

      const objectProperties = objectType.getProperties().map((p) => p.name);
      const isPrismaClientLike = prismaClientProperties.every((property) => {
        return objectProperties.includes(property);
      });

      if (!isPrismaClientLike) return;

      const propertyType = services.getTypeAtLocation(node.callee.property);

      const typeProperties = propertyType
        .getCallSignatures()?.[0]
        ?.getTypeParameters()?.[0]
        ?.getNonNullableType()
        ?.getProperties()
        .map((p) => p.name);

      const isSelectMethodLike = typeProperties?.includes(selectProperty);

      if (!isSelectMethodLike) return;

      const args = node.arguments;
      const [query] = args;

      if (!query || query.type !== AST_NODE_TYPES.ObjectExpression) {
        return context.report({
          node,
          messageId: RuleError.MissingQueryArgument,
          suggest: [
            {
              messageId: RuleSuggestion.AddQueryArgument,
              fix: (fixer) => {
                return fixer.replaceTextRange(
                  [node.range[1] - 2, node.range[1]],
                  `({ ${selectProperty}: {} })`
                );
              }
            }
          ]
        });
      }

      const properties = query.properties;

      const hasSelectProperty = properties.some((property) => {
        if (property.type !== AST_NODE_TYPES.Property) return false;

        const key = property.key;
        if (key.type !== AST_NODE_TYPES.Identifier) return false;

        return key.name === selectProperty;
      });

      if (!hasSelectProperty) {
        return context.report({
          node: query,
          messageId: RuleError.MissingSelectProperty,
          suggest: [
            {
              messageId: RuleSuggestion.AddSelectProperty,
              fix: (fixer) => {
                const lastProperty = properties[properties.length - 1];

                if (!lastProperty) {
                  return fixer.replaceTextRange(
                    [node.range[1] - 4, node.range[1]],
                    `({ ${selectProperty}: {} })`
                  );
                }

                let whitespace = ", ";

                if (properties[0]) {
                  const charsBefore =
                    properties[0].range[0] - (query.range[0] + 1);
                  const propertyText = context.sourceCode.getText(
                    properties[0]
                  );

                  whitespace =
                    "," +
                    context.sourceCode
                      .getText(properties[0], charsBefore)
                      .replace(propertyText, "");
                }

                return fixer.insertTextAfter(
                  lastProperty,
                  `${whitespace}${selectProperty}: {}`
                );
              }
            }
          ]
        });
      }

      return;
    }
  }),
  meta: {
    type: "problem",
    docs: {
      description:
        "Require select property in a query argument while using Prisma.",
      recommended: "recommended"
    },
    messages: {
      [RuleError.MissingQueryArgument]:
        "Missing query argument with a select property.",
      [RuleError.MissingSelectProperty]:
        "Missing select property in the query argument.",
      [RuleSuggestion.AddQueryArgument]:
        "Add query argument with a select property",
      [RuleSuggestion.AddSelectProperty]: "Add select property"
    },
    hasSuggestions: true,
    schema: [] // no options
  },
  defaultOptions: []
});
