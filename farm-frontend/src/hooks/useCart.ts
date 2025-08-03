import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, removeFromCart } from '../api/client';

export const useCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCart(productId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => removeFromCart(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  });
};
