import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

export default CategoryType;
