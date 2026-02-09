"use client";

import { useMemo, useState } from "react";
import { useUsersData } from "../../../../hooks/users-hook";
import { Pagination } from "@/app/components/ui/pagination";
import DataTable from "@/app/components/ui/DataTable";
import { Column } from "@/app/types/Column";
import { UserResponse } from "@/app/types/response/UserResponse";
import { FaEdit } from "react-icons/fa";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useUsersData(page);
  const columns: Column<UserResponse>[] = useMemo(
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
        key: "email",
        header: "Email",
        render: (row) => (
          <span className="font-medium text-black">{row.email}</span>
        ),
      },
      {
        key: "role",
        header: "Role",
        render: (row) => (
          <span className="font-medium text-black">{row.role}</span>
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
          </div>
        ),
      },
    ],
    [],
  );
  return (
    <div className="space-y-6">
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Management</h2>

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
