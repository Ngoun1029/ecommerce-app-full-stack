import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { OrderResponse } from "@/app/types/response/OrderResponse";
import { useQuery } from "@tanstack/react-query";

export function useOrdersData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<OrderResponse[], meta>, Error>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/orders/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      return json as ApiResponse<OrderResponse[], meta>;
    },
  });
}