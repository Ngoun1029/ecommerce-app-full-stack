"use client";

import { DetailProps } from "@/app/types/DetailProps";
import { useEffect, useState } from "react";

type ProductDetail = {
  id: number;
  name: string;
  image: Record<string, string>;
  price: number;
  category: string;
  rate: number;
  description: string;
  color: string[];
  status: boolean;
  createdAt: string;
};

export default function ProductDetailDialog({
  open,
  setOpen,
  id,
}: DetailProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductDetail | null>(null);

  /* ---------------- Mount Animation ---------------- */
  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 200);
  }, [open]);

  /* ---------------- Fetch Detail ---------------- */
  useEffect(() => {
    if (!open || !id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/detail/${id}`);
        if (!res.ok) throw new Error("Failed");

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

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Product Detail
            </h2>
            <p className="text-xs text-gray-500">View product information</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {loading || !data ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* LEFT */}
              <div className="space-y-5">
                <Info label="Product Name" value={data.name} />
                <Info label="Price" value={`$${data.price}`} />
                <Info label="Category" value={data.category} />

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Description
                  </p>
                  <p className="mt-1 rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                    {data.description || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Colors</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {data.color.map((c) => (
                      <span
                        key={c}
                        className="rounded-lg border bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-xs text-gray-500">
                      Product availability
                    </p>
                  </div>

                  <span
                    className={`text-sm font-medium ${
                      data.status ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {data.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Product Images
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Object.values(data.image).map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-2xl border"
                    >
                      <img
                        src={url}
                        alt="product"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Created at: {new Date(data.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
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

/* ---------------- Small Components ---------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="mt-1 rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
        {value}
      </p>
    </div>
  );
}
