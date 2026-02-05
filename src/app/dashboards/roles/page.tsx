"use client";

import { Column } from "@/app/types/Column";
import { useRolesData } from "../../../../hooks/roles-hook";
import { RoleResponse } from "@/app/types/response/RoleResponse";
import { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Pagination } from "@/app/components/ui/pagination";
import DataTable from "@/app/components/ui/DataTable";

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useRolesData(page);
  const columns: Column<RoleResponse>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        render: (row) => (
          <span className="font-medium text-black">{row.id}</span>
        ),
      },
      {
        key: "name",
        header: "Name",
        render: (row) => (
          <span className="font-medium text-black">{row.name}</span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
      },
      {
        key: "actions",
        header: "",
        clickable: false,
        render: (row) => (
          <div className="flex justify-end gap-3">
            <button className="text-blue-400 hover:text-blue-300">
              <FaEdit />
            </button>
            <button className="text-red-400 hover:text-red-300">
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [],
  );
  return (
    <div className="space-y-6">
      <div className="rounded-2xl space-y-1">
        {isError ? (
          <div className="p-10 text-center text-red-400">{error?.message}</div>
        ) : (
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            emptyText={isLoading ? "Loading..." : "No Roles found"}
          />
        )}

        {data?.meta && (
          <Pagination
            page={data.meta.current_page}
            totalPages={data.meta.last_page}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
