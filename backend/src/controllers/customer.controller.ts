import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Cart } from '../models/Cart';

export const getCustomerOverview = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const cart = await Cart.findOne({ customer: user._id });
  const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 });

  res.json({
    account: user,
    cart,
    orderHistory: orders,
  });
};
