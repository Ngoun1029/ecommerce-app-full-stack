"use client";

import { useMemo, useState } from "react";
import { useBannersData } from "../../../../hooks/banners-hook";
import { Pagination } from "@/app/components/ui/pagination";
import { Column } from "@/app/types/Column";
import { BannerResponse } from "@/app/types/response/BannerResponse";
import { FaEdit } from "react-icons/fa";
import BannerDetailDialog from "@/app/components/banners/BannerDetailDialog";
import DataTable from "@/app/components/ui/DataTable";
import BannerAddDialog from "@/app/components/banners/BannerAddDialog";
import BannerEditDialog from "@/app/components/banners/BannerEditDialog";

export default function BannersPage() {
  const [page, setPage] = useState(1);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, isLoading, isError, error } = useBannersData(page);

  const columns: Column<BannerResponse>[] = useMemo(
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
        key: "Description",
        header: "description",
        render: (row) => (
          <span className="font-medium text-black">{row.description}</span>
        ),
      },
      {
        key: "Link",
        header: "link",
        render: (row) => (
          <span className="font-medium text-black">{row.link}</span>
        ),
      },
      {
        key: "createdAt",
        header: "Created",
        render: (row) => (
          <span className="font-medium text-black">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
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
      {/* for dialog */}

      <BannerEditDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        id={selectedId}
        onSuccess={() => {}}
      />

      <BannerDetailDialog
        open={openDetailDialog}
        setOpen={setOpenDetailDialog}
        id={selectedId}
      />

      <BannerAddDialog
        open={openAddDialog}
        setOpen={setOpenAddDialog}
        onSuccess={() => {}}
      />
      <div className="rounded-2xl space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Banners Management</h2>

          <button
            onClick={() => setOpenAddDialog(true)}
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
            emptyText={isLoading ? "Loading..." : "No Banners found"}
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
