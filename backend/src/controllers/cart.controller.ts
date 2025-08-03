import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Types } from 'mongoose';

// Get cart
export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ customer: req.user!.id }).populate('items.product');
  if (!cart) {
    return res.json({ items: [] });
  }
  res.json(cart);
};

// Add / update item
export const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body as { productId: string; quantity: number };
  if (!Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid productId' });
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.status !== 'active') return res.status(400).json({ message: 'Product not available' });
  if (quantity > product.quantityAvailable)
    return res.status(400).json({ message: 'Insufficient stock' });

  let cart = await Cart.findOne({ customer: req.user!.id });
  if (!cart) {
    cart = await Cart.create({
      customer: req.user!.id,
      items: [],
    });
  }

  const existing = cart.items.find((i) => i.product.equals(product._id as Types.ObjectId));
  if (existing) {
    existing.quantity = quantity; // override
    existing.priceAtAdd = product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      priceAtAdd: product.price,
    } as any);
  }
  await cart.save();
  res.json(cart);
};

// Remove item
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  const productId = req.params.productId;
  if (!Types.ObjectId.isValid(productId)) return res.status(400).json({ message: 'Invalid productId' });

  const cart = await Cart.findOne({ customer: req.user!.id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter((i) => !i.product.equals(productId));
  await cart.save();
  res.json(cart);
};
