"use client";

import { Column } from "@/app/types/Column";
import { useProductsData } from "../../../../hooks/products-hook";
import { ProductResponse } from "@/app/types/response/ProductResponse";
import { useMemo, useState } from "react";
import { Pagination } from "@/app/components/ui/pagination";
import DataTable from "@/app/components/ui/DataTable";
import ProductAddDialog from "@/app/components/products/ProductAddDialog";

export default function ProductsPage() {
  const [open, setOpen] = useState(false);

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
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <ProductAddDialog
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
