import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { FarmerProfile } from "../models/FarmerProfile";
import { Product } from "../models/Product";
import { Cart } from "../models/Cart";
import { Order } from "../models/Order";
import { hashPassword } from "../config/auth";
import { Types } from "mongoose";

dotenv.config();

const runSeed = async () => {
  await connectDB();

  // Clear existing (caution: in prod don't do this)
  await Promise.all([
    User.deleteMany({}),
    FarmerProfile.deleteMany({}),
    Product.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
  ]);

  // Create farmers
  const alicePassword = await hashPassword("Password123!");
  const bobPassword = await hashPassword("Password123!");

  const aliceUser = await User.create({
    name: "Alice Farmer",
    email: "alice@farmdirect.test",
    passwordHash: alicePassword,
    role: "farmer",
  });

  const bobUser = await User.create({
    name: "Bob Grower",
    email: "bob@farmdirect.test",
    passwordHash: bobPassword,
    role: "farmer",
  });

  const aliceProfile = await FarmerProfile.create({
    user: aliceUser._id,
    farmName: "Green Acres",
    location: "Northern Region",
    bio: "We grow organic vegetables with love.",
  });

  const bobProfile = await FarmerProfile.create({
    user: bobUser._id,
    farmName: "Sunny Fields",
    location: "Coastal Area",
    bio: "Fresh fruits harvested daily.",
  });

  // Create products
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const products = await Product.create([
    {
      farmer: aliceProfile._id,
      name: "Tomatoes",
      description: "Red juicy tomatoes.",
      category: "vegetables",
      price: 2.5,
      quantityAvailable: 100,
      imageUrl:
        "https://images.unsplash.com/photo-1744659749576-e92c8109ca0f?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      harvestDate: now,
      expiryDate: nextWeek,
      status: "active",
    },
    {
      farmer: aliceProfile._id,
      name: "Maize",
      description: "Sweet maize kernels.",
      category: "grains",
      price: 1.2,
      quantityAvailable: 200,
      imageUrl:
        "https://images.unsplash.com/photo-1590005176489-db2e714711fc?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      harvestDate: now,
      expiryDate: nextMonth,
      status: "active",
    },
    {
      farmer: bobProfile._id,
      name: "Mangoes",
      description: "Tropical ripe mangoes.",
      category: "fruits",
      price: 3.0,
      quantityAvailable: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1583499230190-abf79d56936c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      harvestDate: now,
      expiryDate: nextWeek,
      status: "active",
    },
    {
      farmer: bobProfile._id,
      name: "Milk (1L)",
      description: "Fresh dairy milk.",
      category: "dairy",
      price: 1.8,
      quantityAvailable: 80,
      imageUrl:
        "https://images.unsplash.com/photo-1576186726115-4d51596775d1?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      harvestDate: now,
      expiryDate: nextWeek,
      status: "active",
    },
  ]);

  // Create a customer
  const customerPassword = await hashPassword("CustomerPass1!");
  const customer = await User.create({
    name: "Carol Buyer",
    email: "carol@shopper.test",
    passwordHash: customerPassword,
    role: "customer",
  });

  // Give customer a cart with one item (Tomatoes x3)
  const tomato = products.find((p) => p.name === "Tomatoes")!;
  await Cart.create({
    customer: customer._id,
    items: [
      {
        product: tomato._id,
        quantity: 3,
        priceAtAdd: tomato.price,
      },
    ],
  });

  // Create an order (simulate checkout)
  const order = await Order.create({
    customer: customer._id,
    items: [
      {
        product: tomato._id,
        farmer: aliceProfile._id,
        name: tomato.name,
        price: tomato.price,
        quantity: 3,
        imageUrl: tomato.imageUrl,
      },
    ],
    totalAmount: tomato.price * 3,
    status: "confirmed",
    shippingAddress: "123 Market Street",
    paymentInfo: {
      method: "cash_on_delivery",
      paid: false,
    },
  });

  // Decrement inventory manually to reflect order
  tomato.quantityAvailable -= 3;
  await tomato.save();

  console.log("✅ Seed completed");
  console.log({
    farmers: [aliceUser.email, bobUser.email],
    customer: customer.email,
    sampleOrderId: (order._id as Types.ObjectId).toString(),
  });
  process.exit(0);
};

runSeed().catch((err) => {
  console.error("Seed error", err);
  process.exit(1);
});
