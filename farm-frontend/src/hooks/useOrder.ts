import { useQuery } from '@tanstack/react-query';
import { fetchOrder } from '../api/client';

export const useOrder = (id: string, enabled = true) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id).then((r) => r.data),
    enabled: !!id && enabled,
  });
