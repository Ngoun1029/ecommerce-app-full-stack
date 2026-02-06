import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { ProductResponse } from "@/app/types/response/ProductResponse";
import { useQuery } from "@tanstack/react-query";

export function useProductsData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<ProductResponse[], meta>, Error>({
    queryKey: ["products", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/products/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json as ApiResponse<ProductResponse[], meta>;
    },
  });
}