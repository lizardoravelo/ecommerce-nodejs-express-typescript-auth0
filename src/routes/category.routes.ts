import { Router } from "express";
import { checkJwt, authorize } from "@middleware/authorization";
import categoryCtrl from "@controller/category.controller";

const { getAllCategory, getCategoryById, createCategory, updateCategory } = categoryCtrl;

export const category = (router: Router): void => {
  router
    .route("/")
    .get(checkJwt, authorize(["admin", "user"]), getAllCategory)
    .post(checkJwt, authorize(["admin"]), createCategory);

  router
    .route("/:id")
    .get(checkJwt, authorize(["admin", "user"]), getCategoryById)
    .put(checkJwt, authorize(["admin"]), updateCategory);
};
