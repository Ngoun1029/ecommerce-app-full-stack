"use client";

import { useMemo, useState } from "react";
import { useOrdersData } from "../../../../hooks/orders-hook";
import DataTable from "@/app/components/ui/DataTable";
import { Pagination } from "@/app/components/ui/pagination";
import { Column } from "@/app/types/Column";
import { OrderResponse } from "@/app/types/response/OrderResponse";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useOrdersData(page);
  console.log(data);

  const columns: Column<OrderResponse>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        render: (row) => (
          <span className="text-sm font-semibold text-gray-900">#{row.id}</span>
        ),
      },

      {
        key: "orderCode",
        header: "Order",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{row.orderCode}</span>
            <span className="text-xs text-gray-500">
              {new Date(row.createdAt).toLocaleDateString()}
            </span>
          </div>
        ),
      },

      {
        key: "paymentMethod",
        header: "Payment",
        render: (row) => (
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
            {row.paymentMethod.toUpperCase()}
          </span>
        ),
      },

      {
        key: "status",
        header: "Order Status",
        render: (row) => {
          const statusColor =
            row.status === "PENDING"
              ? "bg-yellow-50 text-yellow-600"
              : row.status === "COMPLETED"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600";

          return (
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
            >
              {row.status}
            </span>
          );
        },
      },

      {
        key: "paymentStatus",
        header: "Payment Status",
        render: (row) => {
          const paymentColor =
            row.paymentStatus === "PAID"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600";

          return (
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${paymentColor}`}
            >
              {row.paymentStatus}
            </span>
          );
        },
      },

      {
        key: "promotionCode",
        header: "Promo",
        render: (row) => (
          <span className="text-sm text-gray-600">
            {row.promotionCode || "-"}
          </span>
        ),
      },

      {
        key: "totalAmount",
        header: "Total",
        render: (row) => (
          <span className="font-semibold text-gray-900">
            ${Number(row.totalAmount).toFixed(2)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories Management</h2>

          <button
            // onClick={() => setOpenCreateDialog(true)}
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
            // onRowClick={(row) => {
            //   setSelectedId(row.id);
            //   setOpenDetailDialog(true);
            // }}
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
