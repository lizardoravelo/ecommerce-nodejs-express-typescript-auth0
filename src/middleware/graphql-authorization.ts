import { rule, shield } from "graphql-shield";
import config from "@config/constants";

const isAuthenticated = rule()((_, __, context) => {
  return !!context.user;
});

const isAdmin = rule()((_, __, context) => {
  const roles = context.user?.[`${config.auth.namespace}roles`] ?? [];
  return roles.includes("admin");
});

export const permissions = shield({
  RootQueryType: {
    categories: isAuthenticated,
    products: isAuthenticated,
    cart: isAuthenticated,
    orders: isAuthenticated,
  },
  Mutation: {
    createCategory: isAdmin,
    updateCategory: isAdmin,
    createProduct: isAdmin,
    updateProduct: isAdmin,
    addItemToCart: isAuthenticated,
    removeItemFromCart: isAuthenticated,
    updateItemQuantityInCart: isAuthenticated,
    buyCart: isAuthenticated,
  },
});
