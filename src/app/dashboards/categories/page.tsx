"use client";

import DataTable from "@/app/components/ui/DataTable";
import { Pagination } from "@/app/components/ui/pagination";
import { Column } from "@/app/types/Column";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCategoriesData } from "../../../../hooks/categories-hooks";
import { useRouter } from "next/navigation";
import CategoryCreateDialog from "@/app/components/categories/CategoryAddDialog";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError, error } = useCategoriesData(page);
  if (isError || error) {
    router.push("/login");
  }

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
      <CategoryCreateDialog
        open={open}
        setOpen={setOpen}
        onSuccess={() => {
          setPage(1); // reset to first page
          // refetch(); // if using react-query
        }}
      />
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories</h2>

          <button
            onClick={() => setOpen(true)}
            className="
    inline-flex items-center gap-2
    rounded-xl border border-primary/20
    bg-primary/10 px-4 py-2
    text-sm font-medium text-primary
    transition
    hover:bg-primary/20
    active:scale-[0.98]
  "
          >
            <span className="text-base leading-none">＋</span>
            Add Category
          </button>
        </div>

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
