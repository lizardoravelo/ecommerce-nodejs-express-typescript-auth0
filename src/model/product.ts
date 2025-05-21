import { Schema, model, Document, Types } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description?: string;
  price: Types.Decimal128;
  stock: number;
  category: Types.ObjectId;
  images?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: undefined,
    },
    price: {
      type: Schema.Types.Decimal128,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct>('Product', productSchema);
export default Product;
