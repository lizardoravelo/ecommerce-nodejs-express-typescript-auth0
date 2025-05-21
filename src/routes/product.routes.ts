import { Router } from "express";
import { checkJwt, authorize } from "@middleware/authorization";
import productCtrl from "@controller/product.controller";

const { getAllProducts, getProductById, createProduct, updateProduct } = productCtrl;

export const product = (router: Router): void => {
  router
    .route("/")
    .get(checkJwt, authorize(["admin", "user"]), getAllProducts)
    .post(checkJwt, authorize(["admin"]), createProduct);

  router
    .route("/:id")
    .get(checkJwt, authorize(["admin", "user"]), getProductById)
    .put(checkJwt, authorize(["admin"]), updateProduct);
};
