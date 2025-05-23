import { GraphQLInt, GraphQLObjectType } from "graphql";
import ProductType from "@graphql/types/ProductType";
import Product from "@model/product";

const CartItemType = new GraphQLObjectType({
  name: "CartItem",
  fields: () => ({
    product: {
      type: ProductType,
      resolve: async (parent) => {
        return await Product.findById(parent.productId);
      },
    },
    quantity: { type: GraphQLInt },
  }),
});

export default CartItemType;
