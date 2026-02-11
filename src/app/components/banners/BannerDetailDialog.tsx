"use client";

import { DetailProps } from "@/app/types/DetailProps";
import { useEffect, useState } from "react";

type BannerDetail = {
  id: number;
  name: string;
  image: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
};

export default function BannerDetailDialog({
  open,
  setOpen,
  id,
}: DetailProps) {
  const [data, setData] = useState<BannerDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/banners/detail/${id}`);
        if (!res.ok) throw new Error("Failed to fetch banner");

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, id]);

  if (!open) return null;

  const formatDate = (date: string) =>
    new Date(date).toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Banner Details
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
            <p className="text-sm text-gray-500">Loading banner...</p>
          ) : data ? (
            <>
              {/* Image */}
              {data.image && (
                <div className="flex justify-center">
                  <img
                    src={data.image}
                    alt={data.name}
                    className="h-40 w-full max-w-md rounded-2xl object-cover border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-sm text-gray-900">{data.name}</p>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {data.description}
                </p>
              </div>

              {/* Link */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700">Link</p>
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {data.link}
                </a>
              </div>

              {/* Created At */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Created At
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(data.createdAt)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Updated At
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(data.updatedAt)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-red-500">Failed to load banner</p>
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
