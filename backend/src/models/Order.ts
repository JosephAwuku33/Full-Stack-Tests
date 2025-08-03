import { Schema, model, Document, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  farmer: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'rejected';
  shippingAddress?: string;
  paymentInfo: {
    method: 'credit_card' | 'mobile_money' | 'cash_on_delivery';
    paid: boolean;
    transactionId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    farmer: { type: Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'rejected'],
      default: 'pending',
    },
    shippingAddress: { type: String },
    paymentInfo: {
      method: { type: String, enum: ['credit_card', 'mobile_money', 'cash_on_delivery'], required: true },
      paid: { type: Boolean, default: false },
      transactionId: { type: String },
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
