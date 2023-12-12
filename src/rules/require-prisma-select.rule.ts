import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { RuleModule } from "@typescript-eslint/utils/ts-eslint";

export const RequirePrismaSelectError = {
  MissingQueryArgument: "MissingQueryArgument",
  MissingSelectProperty: "MissingSelectProperty"
} as const;

type RequirePrismaSelectError =
  (typeof RequirePrismaSelectError)[keyof typeof RequirePrismaSelectError];

const prismaMethods = [
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "create",
  "update",
  "upsert",
  "delete",
  "count"
];

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

        const property = node.callee.property;
        if (property.type !== AST_NODE_TYPES.Identifier) return;

        if (!prismaMethods.includes(property.name)) return;

        const args = node.arguments;

        if (args.length === 0) {
          return context.report({
            node: node.callee,
            messageId: RequirePrismaSelectError.MissingQueryArgument
          });
        }

        const [query] = args;

        if (query.type !== AST_NODE_TYPES.ObjectExpression) {
          return context.report({
            node: query,
            messageId: RequirePrismaSelectError.MissingQueryArgument
          });
        }

        const properties = query.properties;

        const hasSelectProperty = properties.some((property) => {
          if (property.type !== AST_NODE_TYPES.Property) return false;

          const key = property.key;
          if (key.type !== AST_NODE_TYPES.Identifier) return false;

          return key.name === "select";
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
