"use client";

import { Column } from "@/app/types/Column";
import { useProductsData } from "../../../../hooks/products-hook";
import { ProductResponse } from "@/app/types/response/ProductResponse";
import { useMemo, useState } from "react";
import { Pagination } from "@/app/components/ui/pagination";
import DataTable from "@/app/components/ui/DataTable";
import ProductAddDialog from "@/app/components/products/ProductAddDialog";
import ProductDetailDialog from "@/app/components/products/ProductDetailDialog";
import { FaEdit } from "react-icons/fa";
import ProductEditDialog from "@/app/components/products/ProductEditDialog";

export default function ProductsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useProductsData(page);
  console.log(data);
  const columns: Column<ProductResponse>[] = useMemo(
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
        render: (row) => <span>{row.name}</span>,
      },
      {
        key: "image",
        header: "Image",
        render: (row) => (
          <img
            src={row.image}
            alt={row.name}
            className="w-10 h-10 object-cover rounded"
          />
        ),
      },
      {
        key: "price",
        header: "Price",
        render: (row) => <span>${row.price.toFixed(2)}</span>,
      },
      {
        key: "categoryId",
        header: "Category",
        render: (row) => <span>{row.categoryId}</span>,
      },
      {
        key: "rate",
        header: "Rate",
        render: (row) => <span>{row.rate}</span>,
      },
      {
        key: "description",
        header: "Description",
        render: (row) => (
          <span className="line-clamp-2">{row.description}</span>
        ),
      },
      {
        key: "color",
        header: "Colors",
        render: (row) => (
          <span>{Array.isArray(row.color) ? row.color.join(", ") : "-"}</span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <span
            className={
              row.status
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {row.status ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "createdAt",
        header: "Created At",
        render: (row) => (
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        ),
      },
      {
        key: "updatedAt",
        header: "Updated At",
        render: (row) => (
          <span>{new Date(row.updatedAt).toLocaleDateString()}</span>
        ),
      },
      {
        key: "actions",
        header: "",
        clickable: false,
        render: (row) => (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setOpenEditDialog(true);
                setSelectedId(row.id);
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
      <ProductAddDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        onSuccess={() => {
          setPage(1);
        }}
      />
      <ProductDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        id={selectedId}
      />

      <ProductEditDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        id={selectedId}
        onSuccess={() => {}}
      />
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Products Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage your products, pricing, and images
            </p>
          </div>

          <button
            onClick={() => setOpenCreateDialog(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 
                 bg-linear-to-r from-blue-600 to-indigo-600 
                 text-white text-sm font-medium rounded-xl
                 shadow-lg shadow-blue-500/30
                 hover:shadow-xl hover:scale-[1.02]
                 transition-all"
          >
            ＋ Add Product
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
