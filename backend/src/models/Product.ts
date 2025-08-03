import { Schema, model, Document, Types } from 'mongoose';

export type Category = 'vegetables' | 'fruits' | 'grains' | 'dairy' | string;

export interface IProduct extends Document {
  farmer: Types.ObjectId;
  name: string;
  description?: string;
  category: Category;
  price: number;
  quantityAvailable: number;
  imageUrl: string;
  harvestDate: Date;
  expiryDate: Date;
  status: 'active' | 'out_of_stock' | 'expired' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: 'FarmerProfile', required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['vegetables', 'fruits', 'grains', 'dairy'], required: true },
    price: { type: Number, required: true, min: 0 },
    quantityAvailable: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    harvestDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'out_of_stock', 'expired', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Virtual or pre-save to auto-update status could be added in service layer.

export const Product = model<IProduct>('Product', productSchema);
