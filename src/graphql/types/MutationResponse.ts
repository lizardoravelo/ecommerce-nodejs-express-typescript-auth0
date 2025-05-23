import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";

/**
 * Reusable response pattern for GraphQL mutations
 * @param typeName The base name for the response (e.g. "Product", "Category")
 * @param payloadType The GraphQLObjectType of the entity being returned
 */
export function createMutationResponseType(typeName: string, payloadType: any) {
  return new GraphQLObjectType({
    name: `${typeName}MutationResponse`,
    fields: () => ({
      success: { type: GraphQLBoolean },
      message: { type: GraphQLString },
      payload: { type: payloadType },
    }),
  });
}
