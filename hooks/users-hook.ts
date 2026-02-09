import { ApiResponse } from "@/app/types/ApiResponse";
import { meta } from "@/app/types/Meta";
import { UserResponse } from "@/app/types/response/UserResponse";
import { useQuery } from "@tanstack/react-query";

export function useUsersData(page: number) {
  const PAGE_SIZE = 10;
  return useQuery<ApiResponse<UserResponse[], meta>, Error>({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await fetch(
        `/api/users/view?page=${page}&perPage=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const json = await res.json();
      return json as ApiResponse<UserResponse[], meta>;
    },
  });
}
