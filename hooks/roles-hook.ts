import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { RoleResponse } from "@/app/types/response/RoleResponse";
import { useQuery } from "@tanstack/react-query";

export function useRolesData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<RoleResponse[], meta>, Error>({
    queryKey: ["roles", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/roles/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch roles");
      const json = await res.json();
      return json as ApiResponse<RoleResponse[], meta>;
    },
  });
}