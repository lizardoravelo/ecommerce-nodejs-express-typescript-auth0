import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import CartItemType from "@graphql/types/CartItemType";

const CartType = new GraphQLObjectType({
  name: "Cart",
  fields: () => ({
    _id: { type: GraphQLID },
    user: { type: GraphQLString },
    items: { type: new GraphQLList(CartItemType) },
  }),
});

export default CartType;
