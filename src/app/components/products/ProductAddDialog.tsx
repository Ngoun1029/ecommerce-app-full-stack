"use client";

import { Props } from "@/app/types/CreateProp";
import { useState } from "react";
import { usePagination } from "../../../../utils/usePagination";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import DropDown from "../ui/DropDown";

export default function ProductAddDialog({ open, setOpen }: Props) {
  const { items, loading, hasMore, fetchMore } =
    usePagination<CategoryResponse>("/api/categories/lists", 10);

  const [category, setCategory] =
    useState<CategoryResponse | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          Add Product
        </h2>

        {/* Category Select */}
        <DropDown<CategoryResponse>
          label="Category"
          placeholder="Select category"
          value={category}
          items={items}
          loading={loading}
          hasMore={hasMore}
          fetchMore={fetchMore}
          onChange={(item) => {
            setCategory(item);
          }}
        />
      </div>
    </div>
  );
}
