export interface AuthRegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'customer';
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'farmer' | 'customer';
  };
  token: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantityAvailable: number;
  imageUrl: string;
  harvestDate: string;
  expiryDate: string;
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  farmer: any; // can narrow later
}

export interface ProductQueryParams {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}

export interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  priceAtAdd: number;
}

export interface Cart {
  customer: string;
  items: {
    product: string;
    quantity: number;
    priceAtAdd: number;
  }[];
  updatedAt: string;
}
