import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { ShippingResponse } from "@/app/types/response/ShippingResponse";
import { UserResponse } from "@/app/types/response/UserResponse";
import { useQuery } from "@tanstack/react-query";

export function useShippingsData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<ShippingResponse[], meta>, Error>({
    queryKey: ["shippings", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/shippings/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch shipping");
      const json = await res.json();
      return json as ApiResponse<ShippingResponse[], meta>;
    },
  });
}
