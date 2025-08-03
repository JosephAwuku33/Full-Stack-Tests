import { Schema, model, Document } from 'mongoose';

export type Role = 'farmer' | 'customer';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'customer'], required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
