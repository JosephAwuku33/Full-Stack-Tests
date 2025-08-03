import { useQuery } from '@tanstack/react-query';
import { fetchCustomerOrders } from '../api/client';

export const useCustomerOrders = () =>
  useQuery({
    queryKey: ['customerOrders'],
    queryFn: () => fetchCustomerOrders().then((r) => r.data),
  });
