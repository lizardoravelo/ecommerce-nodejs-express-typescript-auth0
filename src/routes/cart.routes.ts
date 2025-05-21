import { Router } from "express";
import { checkJwt, authorize } from "@middleware/authorization";
import cartCtrl from "@controller/cart.controller";

const { getMyCart, addItemToCart, updateItemQuantityInCart, removeItemFromCart, buyCart } = cartCtrl;

export const cart = (router: Router): void => {
  router
    .route("/cart")
    .get(checkJwt, authorize(["user", "admin"]), getMyCart) // Get current user's cart
    .post(checkJwt, authorize(["user", "admin"]), addItemToCart); // Add item to cart

  router
    .route("/cart/:id")
    .put(checkJwt, authorize(["user", "admin"]), updateItemQuantityInCart) // Update item quantity
    .delete(checkJwt, authorize(["user", "admin"]), removeItemFromCart); // Remove item from cart

  // Buy the cart (checkout)
  router.post("/cart/buy", checkJwt, authorize(["user", "admin"]), buyCart);
};
