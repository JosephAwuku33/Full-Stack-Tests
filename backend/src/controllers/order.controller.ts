import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { FarmerProfile } from "../models/FarmerProfile";
import { Types } from "mongoose";

export const checkout = async (req: AuthRequest, res: Response) => {
  const { shippingAddress, paymentMethod } = req.body as {
    shippingAddress: string;
    paymentMethod: "credit_card" | "mobile_money" | "cash_on_delivery";
  };

  const cart = await Cart.findOne({ customer: req.user!.id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart empty" });
  }

  // Fetch all products involved
  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).populate(
    "farmer"
  );

  // Validate availability and build order items
  let total = 0;
  const orderItems: any[] = [];

  for (const item of cart.items) {
    const prod = products.find((p) =>
      (p._id as Types.ObjectId).equals(item.product)
    );
    if (!prod)
      return res
        .status(400)
        .json({ message: `Product ${item.product} not found` });
    if (prod.status !== "active") {
      return res
        .status(400)
        .json({ message: `Product ${prod.name} is not active` });
    }
    if (prod.quantityAvailable < item.quantity) {
      return res
        .status(400)
        .json({
          message: `Insufficient stock for ${prod.name}, available: ${prod.quantityAvailable}`,
        });
    }
    // expiry check
    if (new Date() > prod.expiryDate) {
      return res
        .status(400)
        .json({ message: `Product ${prod.name} has expired` });
    }

    orderItems.push({
      product: prod._id,
      farmer: (prod.farmer as any)._id,
      name: prod.name,
      price: item.priceAtAdd,
      quantity: item.quantity,
      imageUrl: prod.imageUrl,
    });

    total += item.priceAtAdd * item.quantity;
  }

  // Decrement inventory (no transaction here; in more advanced version wrap or use two-phase)
  for (const item of cart.items) {
    const prod = products.find((p) =>
      (p._id as Types.ObjectId).equals(item.product)
    )!;
    prod.quantityAvailable -= item.quantity;
    if (prod.quantityAvailable <= 0) {
      prod.status = "out_of_stock";
      prod.quantityAvailable = 0;
    }
    await prod.save();
  }

  // Create order
  const order = await Order.create({
    customer: req.user!.id,
    items: orderItems,
    totalAmount: total,
    status: "confirmed",
    shippingAddress,
    paymentInfo: {
      method: paymentMethod,
      paid: paymentMethod === "credit_card", // naive; real would involve payment gateway
    },
  });

  // Clear cart
  await Cart.findOneAndUpdate({ customer: req.user!.id }, { items: [] });

  res.status(201).json(order);
};

export const getCustomerOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ customer: req.user!.id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  if (!Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid order ID" });

  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  // ownership check: customer or farmer involved
  if (req.user!.role === "customer") {
    if (!order.customer.equals(req.user!.id))
      return res.status(403).json({ message: "Forbidden" });
  } else if (req.user!.role === "farmer") {
    // check if any item belongs to that farmer
    const farmerProfile = await FarmerProfile.findOne({ user: req.user!.id });
    if (!farmerProfile)
      return res.status(404).json({ message: "Farmer profile missing" });
    const has = order.items.some((it) =>
      it.farmer.equals(farmerProfile._id as Types.ObjectId)
    );
    if (!has) return res.status(403).json({ message: "Forbidden" });
  }

  res.json(order);
};
