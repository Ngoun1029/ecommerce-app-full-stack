import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { BannerResponse } from "@/app/types/response/BannerResponse";
import { useQuery } from "@tanstack/react-query";

export function useBannersData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<BannerResponse[], meta>, Error>({
    queryKey: ["banners", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/banners/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch banners");
      const json = await res.json();
      return json as ApiResponse<BannerResponse[], meta>;
    },
  });
}