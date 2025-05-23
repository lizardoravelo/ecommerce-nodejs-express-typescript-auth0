import { GraphQLSchema } from "graphql";
import RootQuery from "@graphql/RootQuery";
import Mutation from "@graphql/Mutation";

const baseSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default baseSchema;
