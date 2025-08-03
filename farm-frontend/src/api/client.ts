import api from "./axios";
import {
  type AuthLoginPayload,
  type AuthRegisterPayload,
  type AuthResponse,
  type ProductQueryParams,
  type Product,
  type Cart,
} from "@/types";

// Auth
export const register = (payload: AuthRegisterPayload) =>
  api.post<AuthResponse>("/auth/register", payload);
export const login = (payload: AuthLoginPayload) =>
  api.post<AuthResponse>("/auth/login", payload);

// Products
export const fetchProducts = (params?: ProductQueryParams) =>
  api.get<{ meta: unknown; data: Product[] }>("/products", { params });

export const fetchProduct = (id: string) => api.get<Product>(`/products/${id}`);

// Cart
export const getCart = () => api.get<Cart>("/customer/cart");
export const addToCart = (productId: string, quantity: number) =>
  api.post("/customer/cart/items", { productId, quantity });
export const removeFromCart = (productId: string) =>
  api.delete(`/customer/cart/items/${productId}`);

// Checkout
export interface CheckoutPayload {
  shippingAddress: string;
  paymentMethod: "credit_card" | "mobile_money" | "cash_on_delivery";
}
export const checkout = (payload: CheckoutPayload) =>
  api.post("/customer/checkout", payload);

// Orders
export const fetchCustomerOrders = () => api.get("/customer/orders");
export const fetchOrder = (id: string) => api.get(`/orders/${id}`);

// Farmer
export const fetchFarmerDashboard = () => api.get("/farmer/dashboard");
