import { Request, Response } from "express";
import Cart from "@model/cart";
import Product from "@model/product";
import Order from "@model/order";
import OrderDetail from "@model/order-detail";
import handleErrorResponse from "@error/handle-error";
import { getAuthUser } from "@utils/get-auth-user";

interface ICartController {
  buyCart: (req: Request, res: Response) => Promise<void>;
  getMyCart: (req: Request, res: Response) => Promise<void>;
  addItemToCart: (req: Request, res: Response) => Promise<void>;
  removeItemFromCart: (req: Request<{ id: string }>, res: Response) => Promise<void>;
  updateItemQuantityInCart: (req: Request<{ id: string }>, res: Response) => Promise<void>;
}

const cartCtrl: ICartController = {
  buyCart: async (req: Request, res: Response): Promise<void> => {
    const user = getAuthUser(req);
    const session = await Order.startSession();
    session.startTransaction();

    try {
      const cart = await Cart.findOne({ userId: user.sub }).populate("items.productId");

      if (!cart || cart.items.length === 0) {
        res.status(400).json({ error: "Cart is empty or not found" });
        return;
      }

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

      const newOrder = new Order({
        user: user.sub,
        totalAmount,
        status: "pending",
        paymentMethod: "card",
        shippingAddress: req.body.shippingAddress,
      });

      await newOrder.save({ session });

      const finalizedDetails = orderDetails.map((detail) => ({
        ...detail,
        orderId: newOrder._id,
      }));

      await OrderDetail.insertMany(finalizedDetails, { session });
      await Cart.deleteOne({ userId: user.sub }, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Order successfully created from cart",
        order: newOrder,
        orderDetails: finalizedDetails,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      handleErrorResponse(res, err);
    }
  },

  getMyCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = getAuthUser(req);
      const cart = await Cart.findOne({ userId: user.sub }).populate("items.productId");

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      res.status(200).json(cart);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  addItemToCart: async (req: Request, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;
    const user = getAuthUser(req);

    if (!productId || !quantity) {
      res.status(400).json({ error: "Product ID and quantity are required" });
      return;
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      if (product.stock < quantity) {
        res.status(400).json({ error: "Insufficient stock" });
        return;
      }

      let cart = await Cart.findOne({ user: user.sub });

      if (!cart) {
        cart = new Cart({ user: user.sub, items: [] });
      }

      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();

      res.status(200).json({ message: "Item added to cart successfully", cart });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  removeItemFromCart: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { productId } = req.body;
    const user = getAuthUser(req);

    if (!productId) {
      res.status(400).json({ error: "Product ID is required" });
      return;
    }

    try {
      const cart = await Cart.findOne({ user: user.sub });
      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

      if (cart.items.length === 0) {
        await Cart.deleteOne({ user: user.sub });
        res.status(200).json({ message: "Cart is now empty and was removed." });
      } else {
        await cart.save();
        res.status(200).json({ message: "Item removed from cart successfully", cart });
      }
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  updateItemQuantityInCart: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;
    const user = getAuthUser(req);

    if (!productId || !quantity) {
      res.status(400).json({ error: "Product ID and quantity are required" });
      return;
    }

    try {
      const product = await Product.findById(productId);
      if (!product || product.stock < quantity) {
        res.status(400).json({ error: "Insufficient stock or product not found" });
        return;
      }

      const cart = await Cart.findOne({ user: user.sub });
      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Item quantity updated successfully", cart });
      } else {
        res.status(404).json({ error: "Item not found in cart" });
      }
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
};

export default cartCtrl;
