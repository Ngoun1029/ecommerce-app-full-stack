"use client";

import { useMemo, useState } from "react";
import { useShippingsData } from "../../../../hooks/shippings-hook";
import { Pagination } from "@/app/components/ui/pagination";
import DataTable from "@/app/components/ui/DataTable";
import { FaEdit } from "react-icons/fa";
import { Column } from "@/app/types/Column";
import { ShippingResponse } from "@/app/types/response/ShippingResponse";

export default function ShippingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useShippingsData(page);

  const columns: Column<ShippingResponse>[] = useMemo(
    () => [
      {
        key: "id",
        header: "ID",
        render: (row) => (
          <span className="font-medium text-black">{row.id}</span>
        ),
      },
      {
        key: "user",
        header: "User",
        render: (row) => (
          <span className="font-medium text-black">{row.user}</span>
        ),
      },
      {
        key: "city",
        header: "City",
        render: (row) => (
          <span className="font-medium text-black">{row.city}</span>
        ),
      },
      {
        key: "stats",
        header: "Stats",
        render: (row) => (
          <span className="font-medium text-black">{row.stats}</span>
        ),
      },
      {
        key: "countryCode",
        header: "Country Code",
        render: (row) => (
          <span className="font-medium text-black">{row.countryCode}</span>
        ),
      },
      {
        key: "postalCode",
        header: "Postal Code",
        render: (row) => (
          <span className="font-medium text-black">{row.postalCode}</span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        render: (row) => new Date(row.createdAt).toLocaleDateString(),
      },
      
    ],
    [],
  );
  return (
    <div className="space-y-6">
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Shipping Management</h2>
        </div>
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
