import { parse, OperationDefinitionNode } from "graphql";

const isIntrospectionQuery = (query: string): boolean => {
  if (!query) return false;

  try {
    const parsed = parse(query);

    // Find all top-level fields in all operations
    for (const definition of parsed.definitions) {
      if (definition.kind === "OperationDefinition") {
        const opDef = definition as OperationDefinitionNode;
        for (const selection of opDef.selectionSet.selections) {
          if (selection.kind === "Field" && !selection.name.value.startsWith("__")) {
            return false;
          }
        }
      }
    }
    return true;
  } catch {
    return false;
  }
};

export default isIntrospectionQuery;
