import { useQuery } from '@tanstack/react-query';
import { fetchFarmerDashboard } from '../api/client';

export const useFarmerDashboard = () =>
  useQuery({
    queryKey: ['farmerDashboard'],
    queryFn: () => fetchFarmerDashboard().then((r) => r.data),
  });
