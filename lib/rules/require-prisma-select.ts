import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree
} from "@typescript-eslint/utils";
import { isObjectType, isTypeFlagSet } from "ts-api-utils";
import { Type, TypeFlags } from "typescript";

export const requirePrismaSelect = "require-prisma-select";

export const RuleError = {
  MissingQueryArgument: "missing-query-argument",
  MissingSelectProperty: "missing-select-property",
  IncorrectQueryValue: "incorrect-query-value"
} as const;
export type RuleError = (typeof RuleError)[keyof typeof RuleError];

export const RuleSuggestion = {
  AddQueryArgument: "add-query-argument",
  AddSelectProperty: "add-select-property",
  ReplaceQueryValue: "replace-query-value"
} as const;

export type RuleSuggestion =
  (typeof RuleSuggestion)[keyof typeof RuleSuggestion];

export const RuleErrorToSuggestion = {
  [RuleError.MissingQueryArgument]: RuleSuggestion.AddQueryArgument,
  [RuleError.MissingSelectProperty]: RuleSuggestion.AddSelectProperty,
  [RuleError.IncorrectQueryValue]: RuleSuggestion.ReplaceQueryValue
} as const;

const prismaClientProperties = [
  "$executeRaw",
  "$executeRawUnsafe",
  "$queryRaw",
  "$queryRawUnsafe"
];

const selectPropertyName = "select";

const createRule = ESLintUtils.RuleCreator(
  () =>
    "https://github.com/Heljas/eslint-plugin-require-prisma-select/blob/main/docs.md"
);

export const rule = createRule({
  create: (context) => ({
    CallExpression: (node) => {
      if (node.callee.type !== AST_NODE_TYPES.MemberExpression) return;

      const object = node.callee.object;
      if (object.type !== AST_NODE_TYPES.MemberExpression) return;

      const nestedObject = object.object;
      if (nestedObject.type !== AST_NODE_TYPES.Identifier) return;

      const services = ESLintUtils.getParserServices(context);

      const objectType = services.getTypeAtLocation(nestedObject);

      if (!isTypeFlagSet(objectType, TypeFlags.Object)) return;

      const objectProperties = objectType.getProperties().map((p) => p.name);
      const isPrismaClientLike = prismaClientProperties.every((property) => {
        return objectProperties.includes(property);
      });

      if (!isPrismaClientLike) return;

      const property = node.callee.property;
      if (property.type !== AST_NODE_TYPES.Identifier) return;

      if (property.name === "count") return;

      const propertyType = services.getTypeAtLocation(node.callee.property);

      const baseSelectType = propertyType
        .getCallSignatures()?.[0]
        ?.getTypeParameters()?.[0]
        ?.getNonNullableType()
        .getConstraint();

      const typeProperties = baseSelectType?.getProperties();
      if (!typeProperties) return;

      const typePropertiesNames = typeProperties.map((p) => p.name);
      const isSelectMethodLike =
        typePropertiesNames.includes(selectPropertyName);
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
                  `({ ${selectPropertyName}: {} })`
                );
              }
            }
          ]
        });
      }

      if (!baseSelectType) return;
      const typeChecker = services.program.getTypeChecker();

      function visitSelectObjectLike({
        type,
        expression,
        reportMissingSelectProperty
      }: {
        type: Type;
        expression: TSESTree.ObjectExpression;
        reportMissingSelectProperty?: boolean;
      }) {
        const selectPropertyType = type?.getProperty("select");
        if (!selectPropertyType?.valueDeclaration) return;

        const selectProperty = expression.properties.find((property) => {
          if (property.type !== AST_NODE_TYPES.Property) return false;

          const key = property.key;
          if (key.type !== AST_NODE_TYPES.Identifier) return false;

          return key.name === selectPropertyName;
        });

        if (
          !selectProperty ||
          selectProperty?.type !== AST_NODE_TYPES.Property ||
          selectProperty.value.type !== AST_NODE_TYPES.ObjectExpression
        ) {
          if (!reportMissingSelectProperty) return;
          const properties = expression.properties;
          return context.report({
            node: expression,
            messageId: RuleError.MissingSelectProperty,
            suggest: [
              {
                messageId: RuleSuggestion.AddSelectProperty,
                fix: (fixer) => {
                  const lastProperty = properties[properties.length - 1];

                  if (!lastProperty) {
                    return fixer.replaceTextRange(
                      [expression.range[1] - 2, expression.range[1]],
                      `{ ${selectPropertyName}: {} }`
                    );
                  }

                  let whitespace = ", ";

                  if (properties[0]) {
                    const charsBefore =
                      properties[0].range[0] - (expression.range[0] + 1);
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
                    `${whitespace}${selectPropertyName}: {}`
                  );
                }
              }
            ]
          });
        }

        const selectType = typeChecker.getTypeOfSymbolAtLocation(
          selectPropertyType,
          selectPropertyType.valueDeclaration
        );

        const selectObject = selectProperty.value;

        for (const selectObjectProperty of selectObject.properties) {
          if (selectObjectProperty.type !== AST_NODE_TYPES.Property) {
            continue;
          }
          const selectObjectPropertyIdentifier = selectObjectProperty.key;
          if (
            selectObjectPropertyIdentifier.type !== AST_NODE_TYPES.Identifier
          ) {
            continue;
          }

          const selectObjectPropertySymbol = selectType
            .getNonNullableType()
            .getProperty(selectObjectPropertyIdentifier.name);

          if (!selectObjectPropertySymbol) continue;

          const selectObjectPropertyType = typeChecker.getTypeOfSymbol(
            selectObjectPropertySymbol
          );

          if (!selectObjectPropertyType.isUnion()) continue;

          const nestedSelectType = selectObjectPropertyType.types.find((t) => {
            if (!isObjectType(t)) return false;
            const name = t.aliasSymbol?.escapedName?.toLowerCase();
            if (!name || !name.endsWith("args")) return false;
            return true;
          });

          if (!nestedSelectType) continue;
          const selectObjectPropertyValue = selectObjectProperty.value;

          if (
            selectObjectPropertyValue.type === AST_NODE_TYPES.Literal &&
            selectObjectPropertyValue.value === true
          ) {
            context.report({
              node: selectObjectPropertyValue,
              messageId: RuleError.IncorrectQueryValue,
              suggest: [
                {
                  messageId: RuleSuggestion.ReplaceQueryValue,
                  fix: (fixer) => {
                    return fixer.replaceTextRange(
                      selectObjectPropertyValue.range,
                      `{ ${selectPropertyName}: {} }`
                    );
                  }
                }
              ]
            });
            continue;
          }

          if (
            selectObjectPropertyValue.type !== AST_NODE_TYPES.ObjectExpression
          ) {
            continue;
          }

          visitSelectObjectLike({
            type: nestedSelectType,
            expression: selectObjectPropertyValue
          });
        }
      }

      return visitSelectObjectLike({
        type: baseSelectType,
        expression: query,
        reportMissingSelectProperty: true
      });
    }
  }),
  name: "require-prisma-select",
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
      [RuleError.IncorrectQueryValue]: "Incorrect query value.",
      [RuleSuggestion.AddQueryArgument]:
        "Add query argument with a select property",
      [RuleSuggestion.AddSelectProperty]: "Add select property",
      [RuleSuggestion.ReplaceQueryValue]: "Replace value with a query object."
    },
    hasSuggestions: true,
    schema: [] // no options
  },
  defaultOptions: []
});
