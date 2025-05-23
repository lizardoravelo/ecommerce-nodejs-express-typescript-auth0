import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import CategoryType from "@graphql/types/CategoryType";
import Category from "@model/category";

const ProductType = new GraphQLObjectType({
  name: "Product",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: {
      type: GraphQLFloat,
      resolve: (parent) => parseFloat(parent.price.toString()),
    },
    stock: { type: GraphQLInt },
    images: { type: GraphQLString },
    category: {
      type: CategoryType,
      resolve: async (parent) => {
        return await Category.findById(parent.category);
      },
    },
  }),
});

export default ProductType;
