import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import Product from "@model/product";
import Cart from "@model/cart";
import Category from "@model/category";
import Order from "@model/order";
import CategoryType from "@graphql/types/CategoryType";
import ProductType from "@graphql/types/ProductType";
import CartType from "@graphql/types/CartType";
import OrderType from "@graphql/types/OrderType";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    categories: {
      type: new GraphQLList(CategoryType),
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { skip = 0, limit = 10, name, description } = args;
        const filters: any = {};
        if (description) filters.description = new RegExp(description, "i");
        if (name) filters.name = new RegExp(name, "i");
        return await Category.find(filters).skip(skip).limit(limit).lean();
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        categoryId: { type: GraphQLString },
        categoryName: { type: GraphQLString },
      },
      resolve: async (_, args) => {
        const { skip = 0, limit = 10, name, description, categoryId, categoryName } = args;
        const filters: any = {};
        if (name) filters.name = new RegExp(name, "i");
        if (description) filters.description = new RegExp(description, "i");

        if (categoryId) {
          filters.category = categoryId;
        } else if (categoryName) {
          const category = await Category.findOne({ name: new RegExp(categoryName, "i") });
          if (category) {
            filters.category = category._id;
          } else {
            return [];
          }
        }

        return await Product.find(filters).skip(skip).limit(limit);
      },
    },
    cart: {
      type: CartType,
      resolve: async (_, __, context) => {
        const userId = context.user?.sub;
        if (!userId) throw new Error("Not authenticated");

        const cart = await Cart.findOne({ user: userId }).populate("items.productId");
        if (!cart) throw new Error("Cart not found");

        return cart;
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      args: {
        skip: { type: GraphQLInt },
        limit: { type: GraphQLInt },
        status: { type: GraphQLString },
      },
      resolve: async (_, args, context) => {
        const { skip = 0, limit = 10, status } = args;
        const filters: any = { user: context.user?.sub };

        if (status) filters.status = new RegExp(status, "i");
        return await Order.find(filters).skip(skip).limit(limit);
      },
    },
  },
});

export default RootQuery;
