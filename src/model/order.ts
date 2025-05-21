import { Schema, model, Document, Types } from "mongoose";

const paymentMethod = ["card"] as const;

export interface IOrder extends Document {
  user: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "card",
      required: true,
      enum: paymentMethod,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
