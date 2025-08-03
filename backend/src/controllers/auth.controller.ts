import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { FarmerProfile } from '../models/FarmerProfile';
import { hashPassword, comparePassword, signToken } from '../config/auth';
import { Types } from "mongoose"

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role: 'farmer' | 'customer';
  };

  // Prevent duplicate
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  if (role === 'farmer') {
    // auto-create empty farmer profile
    await FarmerProfile.create({
      user: user._id,
      farmName: '',
    });
  }

  const token = signToken({ sub: String(user._id), role: user.role });

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ sub: (user._id as Types.ObjectId).toString(), role: user.role });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
};
