import { useQuery } from '@tanstack/react-query';
import { fetchCustomerOrders } from '../api/client';
import { getCart } from '../api/client';
import { useAuthStore } from '../stores/authStore';

export const useCustomerOverview = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['customerOverview'],
    queryFn: async () => {
      const [cartRes, ordersRes] = await Promise.all([
        getCart().then((r) => r.data),
        fetchCustomerOrders().then((r) => r.data),
      ]);
      return {
        cart: cartRes,
        orders: ordersRes,
        account: user,
      };
    },
  });
};
