import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

export const RequirePrismaSelectError = {
  MissingQueryArgument: "MissingQueryArgument",
  MissingSelectProperty: "MissingSelectProperty"
} as const;

type RequirePrismaSelectError =
  (typeof RequirePrismaSelectError)[keyof typeof RequirePrismaSelectError];

const prismaClientProperties = [
  "$connect",
  "$disconnect",
  "$executeRaw",
  "$queryRaw"
];

const querySelectProperty = "select";

const requirePrismaSelect: {
  name: string;
  rule: RuleModule<RequirePrismaSelectError>;
} = {
  name: "require-prisma-select",
  rule: {
    defaultOptions: [],
    meta: {
      type: "problem",
      messages: {
        MissingQueryArgument: "Missing query argument with a select property.",
        MissingSelectProperty: "Missing select property in query argument."
      },
      schema: [] // no options
    },
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

        const isSelectMethodLike =
          typeProperties?.includes(querySelectProperty);

        if (!isSelectMethodLike) return;

        const args = node.arguments;
        const [query] = args;

        if (!query || query.type !== AST_NODE_TYPES.ObjectExpression) {
          return context.report({
            node,
            messageId: RequirePrismaSelectError.MissingQueryArgument
          });
        }

        const properties = query.properties;

        const hasSelectProperty = properties.some((property) => {
          if (property.type !== AST_NODE_TYPES.Property) return false;

          const key = property.key;
          if (key.type !== AST_NODE_TYPES.Identifier) return false;

          return key.name === querySelectProperty;
        });

        if (!hasSelectProperty) {
          return context.report({
            node: query,
            messageId: RequirePrismaSelectError.MissingSelectProperty
          });
        }

        return;
      }
    })
  }
};

export { requirePrismaSelect };
