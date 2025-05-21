import { Router } from "express";
import { checkJwt, authorize } from "@middleware/authorization";
import orderCtrl from "@controller/order.controller";

const { getAllOrders, getOrderById, updateOrderStatus } = orderCtrl;

export const order = (router: Router): void => {
  router.route("/").get(checkJwt, authorize(["admin", "user"]), getAllOrders);

  router
    .route("/:id")
    .get(checkJwt, authorize(["admin", "user"]), getOrderById)
    .patch(checkJwt, authorize(["admin"]), updateOrderStatus);
};
