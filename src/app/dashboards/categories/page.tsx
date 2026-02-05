"use client";

import DataTable from "@/app/components/ui/DataTable";
import { Pagination } from "@/app/components/ui/pagination";
import { Column } from "@/app/types/Column";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { useMemo, useState } from "react";
import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useCategoriesData } from "../../../../hooks/categories-hooks";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useCategoriesData(page);

  const columns: Column<CategoryResponse>[] = useMemo(
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
        key: "status",
        header: "Status",
        render: (row) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                row.status
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
          >
            {row.status ? "Active" : "Inactive"}
          </span>
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
            emptyText={isLoading ? "Loading..." : "No categories found"}
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
