"use client";

import { DetailProps } from "@/app/types/DetailProps";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import { useEffect, useState } from "react";


export default function CategoryDetailDialog({
  open,
  setOpen,
  id,
}: DetailProps) {
  const [data, setData] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !open) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/detail/${id}`);
        if (!res.ok) throw new Error("Failed to fetch category");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Category Details
            </h2>
            <p className="text-xs text-gray-500">
              {data ? `Information about "${data.name}"` : "Loading..."}
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">
          {loading ? (
            <p className="text-sm text-gray-500">Loading category...</p>
          ) : data ? (
            <>
              {/* Image */}
              {data.image && (
                <div className="flex justify-center">
                  <img
                    src={data.image}
                    alt={data.name}
                    className="h-32 w-32 rounded-2xl object-cover border border-gray-200"
                  />
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-sm text-gray-900">{data.name}</p>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Status</p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    data.status
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
                  {data.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Created At</p>
                <p className="text-sm text-gray-900">
                  {new Date(data.createdAt).toLocaleDateString()}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-red-500">Failed to load category</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
