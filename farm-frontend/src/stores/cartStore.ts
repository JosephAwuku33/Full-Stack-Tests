import { create } from 'zustand';

interface CartItemLocal {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItemLocal[];
  setItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  setItem: (productId, quantity) =>
    set((s) => {
      const existing = s.items.find((i) => i.productId === productId);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        };
      }
      return { items: [...s.items, { productId, quantity }] };
    }),
  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
  clear: () => set({ items: [] }),
}));
