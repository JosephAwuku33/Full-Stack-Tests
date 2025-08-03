import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { FarmerProfile } from '../models/FarmerProfile';
import { AuthRequest } from '../middleware/auth';
import { Types } from 'mongoose';

// Farmer creates product
export const createProduct = async (req: AuthRequest, res: Response) => {
  const farmerProfile = await FarmerProfile.findOne({ user: req.user!.id });
  if (!farmerProfile) return res.status(404).json({ message: 'Farmer profile not found' });

  const {
    name,
    description,
    category,
    price,
    quantityAvailable,
    imageUrl,
    harvestDate,
    expiryDate,
  } = req.body;

  const product = await Product.create({
    farmer: farmerProfile._id,
    name,
    description,
    category,
    price,
    quantityAvailable,
    imageUrl,
    harvestDate,
    expiryDate,
    status: quantityAvailable === 0 ? 'out_of_stock' : 'active',
  });

  res.status(201).json(product);
};

// Farmer updates own product
export const updateProduct = async (req: AuthRequest, res: Response) => {
  const productId = req.params.id;
  if (!Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid ID' });

  const farmerProfile = await FarmerProfile.findOne({ user: req.user!.id });
  if (!farmerProfile) return res.status(404).json({ message: 'Farmer profile not found' });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!product.farmer.equals(farmerProfile._id as Types.ObjectId))
    return res.status(403).json({ message: 'Not your product' });

  Object.assign(product, req.body);

  // adjust status if needed
  if (product.quantityAvailable === 0) product.status = 'out_of_stock';
  // expiry logic could be computed elsewhere

  await product.save();
  res.json(product);
};

// Farmer deletes (soft/hard) - here hard
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const productId = req.params.id;
  if (!Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid ID' });

  const farmerProfile = await FarmerProfile.findOne({ user: req.user!.id });
  if (!farmerProfile) return res.status(404).json({ message: 'Farmer profile not found' });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!product.farmer.equals(farmerProfile._id as Types.ObjectId))
    return res.status(403).json({ message: 'Not your product' });

  await product.deleteOne();
  res.status(204).send();
};

// Public: list with filters
export const listProducts = async (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice, page = '1', limit = '12' } = req.query as any;
  const filter: any = { status: 'active' };

  if (search) {
    filter.name = { $regex: new RegExp(search, 'i') };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const lim = Math.min(100, parseInt(limit, 10));

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .populate({
        path: 'farmer',
        populate: { path: 'user', select: 'name' }, // for display
      }),
  ]);

  res.json({
    meta: {
      total,
      page: pageNum,
      limit: lim,
      pages: Math.ceil(total / lim),
    },
    data: products,
  });
};

// Public: get detail
export const getProduct = async (req: Request, res: Response) => {
  const pid = req.params.id;
  if (!Types.ObjectId.isValid(pid)) return res.status(400).json({ message: 'Invalid ID' });
  const product = await Product.findById(pid).populate({
    path: 'farmer',
    populate: { path: 'user', select: 'name email' },
  });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};
