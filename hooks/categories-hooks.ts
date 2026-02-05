import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { useQuery } from "@tanstack/react-query";

export function useCategoriesData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<CategoryResponse[], meta>, Error>({
    queryKey: ["categories", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/categories/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json as ApiResponse<CategoryResponse[], meta>;
    },
  });
}