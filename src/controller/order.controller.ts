import { Request, Response } from "express";
import Order from "@model/order";
import OrderDetail from "@model/order-detail";
import handleErrorResponse from "@error/handle-error";
import { getAuthUser } from "@utils/get-auth-user";

interface IOrderController {
  getAllOrders: (req: Request, res: Response) => Promise<void>;
  getOrderById: (req: Request<{ id: string }>, res: Response) => Promise<void>;
  updateOrderStatus: (req: Request<{ id: string }>, res: Response) => Promise<void>;
}

const orderCtrl: IOrderController = {
  getAllOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = getAuthUser(req);
      const isAdmin = user && user.role === "admin";

      const orders = isAdmin ? await Order.find().lean() : await Order.find({ user: user.sub }).lean();

      const orderIds = orders.map((o) => o._id);
      const orderDetails = await OrderDetail.find({ orderId: { $in: orderIds } }).lean();

      const ordersWithDetails = orders.map((order) => ({
        ...order,
        details: orderDetails.filter((d) => d.orderId.toString() === order._id.toString()),
      }));

      res.status(200).json(ordersWithDetails);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  getOrderById: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const user = getAuthUser(req);
      const order = await Order.findById(req.params.id).lean();

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      if (order.user !== user.sub && user.role !== "admin") {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const orderDetails = await OrderDetail.find({ orderId: order._id }).lean();

      res.status(200).json({ ...order, details: orderDetails });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  updateOrderStatus: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const user = getAuthUser(req);
      const { status } = req.body;

      const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

      if (!updated) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.status(200).json({ message: "Order status updated", order: updated });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
};

export default orderCtrl;
