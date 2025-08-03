import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkout, type CheckoutPayload } from '../api/client';

export const useCheckout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => checkout(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cart'] });
      qc.invalidateQueries({ queryKey: ['customerOrders'] });
    },
  });
};
