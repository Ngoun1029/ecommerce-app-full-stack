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
import CategoryEditDialog from "@/app/components/categories/CategoryEditDialog";
import CategoryDetailDialog from "@/app/components/categories/CategoryDetailDialog";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

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
            <button
              onClick={() => {
                setSelectedId(row.id);
                setOpenEditDialog(true);
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              <FaEdit />
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
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSuccess={() => {
          setPage(1);
        }}
      />

      <CategoryDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        id={selectedId}
      />

      <CategoryEditDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        id={selectedId}
        onSuccess={() => {
          setOpenEditDialog(false);
          setPage(1);
        }}
      />

      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories Management</h2>

          <button
            onClick={() => setOpenCreateDialog(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            <span className="text-lg leading-none">＋</span>
            Add
          </button>
        </div>

        {isError ? (
          <div className="p-10 text-center text-red-400">{error?.message}</div>
        ) : (
          <DataTable
            data={data?.data ?? []}
            columns={columns}
            emptyText={isLoading ? "Loading..." : "No categories found"}
            onRowClick={(row) => {
              setSelectedId(row.id);
              setOpenDetailDialog(true);
            }}
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
