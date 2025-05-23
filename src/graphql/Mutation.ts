import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLFloat } from "graphql";
import Product from "@model/product";
import Cart from "@model/cart";
import Category from "@model/category";
import Order from "@model/order";
import OrderDetail from "@model/order-detail";
import handleGraphQLError from "@error/handle-graphql-error";
import { createMutationResponseType } from "@graphql/types/MutationResponse";
import CategoryType from "@graphql/types/CategoryType";
import ProductType from "@graphql/types/ProductType";
import CartType from "@graphql/types/CartType";
import OrderType from "@graphql/types/OrderType";

const CategoryMutationResponse = createMutationResponseType("Category", CategoryType);
const ProductMutationResponse = createMutationResponseType("Product", ProductType);
const CartMutationResponse = createMutationResponseType("Cart", CartType);
const OrderMutationResponse = createMutationResponseType("Order", OrderType);

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //region: Category
    createCategory: {
      type: CategoryMutationResponse,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const { name, description } = args;
          const category = await new Category({ name, description }).save();
          return {
            success: true,
            message: "Category created successfully",
            payload: category,
          };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },
    updateCategory: {
      type: CategoryMutationResponse,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const { _id, name, description } = args;
          const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            { name, description },
            { new: true, runValidators: true },
          );

          if (!updatedCategory) {
            return {
              success: false,
              message: "Category not found",
              payload: null,
            };
          }
          return {
            success: true,
            message: "Category updated successfully",
            payload: updatedCategory,
          };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },
    // endregion: Category

    //region: Product
    createProduct: {
      type: ProductMutationResponse,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        stock: { type: new GraphQLNonNull(GraphQLInt) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        images: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const { name, description, price, stock, category, images } = args;
          const newProduct = await new Product({ name, description, price, stock, category, images }).save();
          return {
            success: true,
            message: "Product created successfully",
            payload: newProduct,
          };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },
    updateProduct: {
      type: ProductMutationResponse,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        stock: { type: new GraphQLNonNull(GraphQLInt) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        images: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, args) => {
        try {
          const { _id, name, description, price, stock, category, images } = args;

          const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { name, description, price, stock, category, images },
            { new: true, runValidators: true },
          );

          if (!updatedProduct) {
            return {
              success: false,
              message: "Product not found",
              payload: null,
            };
          }

          return {
            success: true,
            message: "Product updated successfully",
            payload: updatedProduct,
          };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },
    // endregion: Product
    // region: Cart
    addItemToCart: {
      type: CartMutationResponse,
      args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { productId, quantity }, context) => {
        try {
          const userId = context.user?.sub;
          if (!userId) throw new Error("Not authenticated");

          const product = await Product.findById(productId);
          if (!product || product.stock < quantity) {
            return {
              success: false,
              message: "Product not found or insufficient stock",
              payload: null,
            };
          }

          let cart = await Cart.findOne({ user: userId });
          if (!cart) cart = new Cart({ user: userId, items: [] });

          const itemIndex = cart.items.findIndex((i) => i.productId.toString() === productId);
          if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
          } else {
            cart.items.push({ productId, quantity });
          }

          await cart.save();
          return {
            success: true,
            message: "Item added to cart",
            payload: cart,
          };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },

    removeItemFromCart: {
      type: CartMutationResponse,
      args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { productId }, context) => {
        try {
          const userId = context.user?.sub;
          if (!userId) throw new Error("Not authenticated");

          const cart = await Cart.findOne({ user: userId });
          if (!cart) throw new Error("Cart not found");

          cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

          if (cart.items.length === 0) {
            await Cart.deleteOne({ user: userId });
            return { success: true, message: "Cart emptied", payload: null };
          }

          await cart.save();
          return { success: true, message: "Item removed", payload: cart };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },

    updateItemQuantityInCart: {
      type: CartMutationResponse,
      args: {
        productId: { type: new GraphQLNonNull(GraphQLID) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { productId, quantity }, context) => {
        try {
          const userId = context.user?.sub;
          if (!userId) throw new Error("Not authenticated");

          const product = await Product.findById(productId);
          if (!product || product.stock < quantity) throw new Error("Invalid stock or product");

          const cart = await Cart.findOne({ user: userId });
          if (!cart) throw new Error("Cart not found");

          const item = cart.items.find((i) => i.productId.toString() === productId);
          if (!item) throw new Error("Item not found in cart");

          item.quantity = quantity;
          await cart.save();

          return { success: true, message: "Quantity updated", payload: cart };
        } catch (err) {
          return handleGraphQLError(err);
        }
      },
    },
    // endregion: Cart

    // region: Order
    buyCart: {
      type: OrderMutationResponse,
      args: {
        shippingAddress: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { shippingAddress }, context) => {
        const session = await Order.startSession();
        session.startTransaction();

        try {
          const userId = context.user?.sub;
          if (!userId) throw new Error("Not authenticated");

          const cart = await Cart.findOne({ user: userId }).populate("items.productId");
          if (!cart || cart.items.length === 0) throw new Error("Cart is empty or not found");

          const items = cart.items as unknown as {
            productId: { _id: string; price: number | string };
            quantity: number;
          }[];

          const orderDetails = items.map((item) => ({
            orderId: undefined,
            productId: item.productId._id,
            quantity: item.quantity,
            price: parseFloat(item.productId.price.toString()),
          }));

          const totalAmount = orderDetails.reduce((sum, detail) => sum + detail.quantity * detail.price, 0);

          const order = new Order({
            user: userId,
            totalAmount,
            status: "pending",
            paymentMethod: "card",
            shippingAddress,
          });
          await order.save({ session });

          const details = items.map((i) => ({ ...i, orderId: order._id }));
          await OrderDetail.insertMany(details, { session });

          await Cart.deleteOne({ user: userId }, { session });

          await session.commitTransaction();
          session.endSession();

          return {
            success: true,
            message: "Order placed successfully",
            payload: order,
          };
        } catch (err) {
          await session.abortTransaction();
          session.endSession();
          return handleGraphQLError(err);
        }
      },
    },
    // endregion: Order
  },
});

export default Mutation;
