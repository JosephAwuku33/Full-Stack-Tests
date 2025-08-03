import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { FarmerProfile } from '../models/FarmerProfile';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

export const getFarmerOverview = async (req: AuthRequest, res: Response) => {
  const farmerProfile = await FarmerProfile.findOne({ user: req.user!.id });
  if (!farmerProfile) return res.status(404).json({ message: 'Farmer profile not found' });

  // Products
  const products = await Product.find({ farmer: farmerProfile._id });

  // Incoming orders: those orders that include items for this farmer
  const orders = await Order.find({ 'items.farmer': farmerProfile._id })
    .sort({ createdAt: -1 })
    .lean();

  // Optionally aggregate per order and extract only relevant items
  const formattedOrders = orders.map((o) => {
    const farmerItems = o.items.filter((it: any) => it.farmer.equals(farmerProfile._id));
    return {
      orderId: o._id,
      customer: o.customer,
      status: o.status,
      totalAmount: o.totalAmount,
      items: farmerItems,
      createdAt: o.createdAt,
    };
  });

  res.json({
    profile: farmerProfile,
    products,
    incomingOrders: formattedOrders,
  });
};
