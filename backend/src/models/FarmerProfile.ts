import { Schema, model, Document, Types } from 'mongoose';

export interface IFarmerProfile extends Document {
  user: Types.ObjectId;
  farmName: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const farmerProfileSchema = new Schema<IFarmerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmName: { type: String, required: true },
    location: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

export const FarmerProfile = model<IFarmerProfile>('FarmerProfile', farmerProfileSchema);
