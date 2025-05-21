import { Router } from "express";

import { cart } from "./cart.routes";
import { category } from "./category.routes";
import { order } from "./order.routes";
import { product } from "./product.routes";
import { health } from "./health.route";

const router: Router = Router();

const routes: {
  [key: string]: (router: Router) => void;
} = { cart, category, order, product, health };

for (const route in routes) {
  const nestedRouter = Router();
  routes[route](nestedRouter);
  router.use(`/api/${route}`, nestedRouter);
}

export { router };
