import { Schema, model, Document, Types } from 'mongoose';

export interface IOrderDetail extends Document {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: Types.Decimal128;
}

const orderDetailSchema = new Schema<IOrderDetail>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

const OrderDetail = model<IOrderDetail>('OrderDetail', orderDetailSchema);
export default OrderDetail;
