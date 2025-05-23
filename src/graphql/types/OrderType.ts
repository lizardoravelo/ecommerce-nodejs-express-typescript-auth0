import { GraphQLFloat, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import OrderDetailType from "@graphql/types/OrderDetailType";
import OrderDetail from "@model/order-detail";

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    _id: { type: GraphQLID },
    user: { type: GraphQLString },
    totalAmount: { type: GraphQLFloat },
    status: { type: GraphQLString },
    paymentMethod: { type: GraphQLString },
    shippingAddress: { type: GraphQLString },
    orderDetails: {
      type: new GraphQLList(OrderDetailType),
      resolve: async (parent) => {
        return await OrderDetail.find({ orderId: parent._id });
      },
    },
  }),
});

export default OrderType;
