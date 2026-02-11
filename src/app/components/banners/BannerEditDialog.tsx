"use client";

import { EditProps } from "@/app/types/EditProps";
import { usePagination } from "../../../../utils/usePagination";
import { ProductListResponse } from "@/app/types/response/ProductResponse";
import DropDown from "../ui/DropDown";

import { useEffect, useState } from "react";

type FormState = {
  name: string;
  image: string;
  description: string;
  link: string;
};

export default function BannerEditDialog({
  open,
  setOpen,
  id,
  onSuccess,
}: EditProps) {
  const [mounted, setMounted] = useState(false);

  /* Products */
  const { items, loading, hasMore, fetchMore } =
    usePagination<ProductListResponse>("/api/products/lists", 5);

  /* Selected product */
  const [product, setProduct] =
    useState<ProductListResponse | null>(null);

  /* Form */
  const [form, setForm] = useState<FormState>({
    name: "",
    image: "",
    description: "",
    link: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Mount animation */
  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 200);
  }, [open]);

  /* Fetch banner detail */
  useEffect(() => {
    if (!open || !id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/banners/detail/${id}`);

        if (!res.ok) throw new Error("Failed to load banner");

        const data = await res.json();

        const banner = data.data;

        /* Fill form */
        setForm({
          name: banner.name,
          image: banner.image,
          description: banner.description,
          link: banner.link,
        });

        /* Set product */
        if (banner.product) {
          setProduct(banner.product);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetail();
  }, [id, open]);

  /* Auto-fill when product changes */
  useEffect(() => {
    if (!product) return;

    setForm((prev) => ({
      ...prev,
      name: product.name,
      image: product.image,
      link: `/products/${product.id}`,
    }));
  }, [product]);

  if (!mounted) return null;

  /* Input handler */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* Submit update */
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch(`/api/banners/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          productId: product?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update banner");
      }

      onSuccess?.();
      setOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Banner
            </h2>
            <p className="text-xs text-gray-500">
              Update banner information
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">

          {/* Product */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Product
            </label>

            <DropDown<ProductListResponse>
              placeholder="Select Product"
              value={product}
              items={items}
              loading={loading}
              hasMore={hasMore}
              fetchMore={fetchMore}
              onChange={setProduct}
              renderValue={(item) => (
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span>{item.name}</span>
                </div>
              )}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span>{item.name}</span>
                </div>
              )}
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Banner Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Image */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Image URL
            </label>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />

            {form.image && (
              <img
                src={form.image}
                className="mt-2 h-24 rounded-lg object-cover"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Link */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Link
            </label>

            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Updating..." : "Update Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}
