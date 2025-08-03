import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProduct } from "../api/client";
import { type ProductQueryParams } from "@/types/index";

export const useProducts = (params?: ProductQueryParams) =>
  useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params).then((r) => r.data),
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id).then((r) => r.data),
    enabled: !!id,
  });
