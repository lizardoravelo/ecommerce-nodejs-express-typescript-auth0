import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLObjectType } from "graphql";
import ProductType from "@graphql/types/ProductType";
import Product from "@model/product";

const OrderDetailType = new GraphQLObjectType({
  name: "OrderDetail",
  fields: () => ({
    _id: { type: GraphQLID },
    product: {
      type: ProductType,
      resolve: async (parent) => {
        return await Product.findById(parent.productId);
      },
    },
    quantity: { type: GraphQLInt },
    price: {
      type: GraphQLFloat,
      resolve: (parent) => parseFloat(parent.price.toString()),
    },
  }),
});

export default OrderDetailType;
