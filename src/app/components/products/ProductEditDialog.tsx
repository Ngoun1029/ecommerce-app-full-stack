"use client";

import { EditProps } from "@/app/types/EditProps";
import { ProductUpdateRequest } from "@/app/types/request/ProductRequest";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";

import { useEffect, useRef, useState } from "react";

import { usePagination } from "../../../../utils/usePagination";
import DropDown from "../ui/DropDown";

/* ======================================================
   Component
====================================================== */

export default function ProductEditDialog({
  open,
  setOpen,
  id,
  onSuccess,
}: EditProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- Category Pagination ---------------- */
  const {
    items,
    loading: catLoading,
    hasMore,
    fetchMore,
  } = usePagination<CategoryResponse>("/api/categories/lists", 10);

  const [category, setCategory] = useState<CategoryResponse | null>(null);

  /* ---------------- Form ---------------- */
  const [form, setForm] = useState<ProductUpdateRequest>({
    name: "",
    price: 0,
    categoryId: 0,
    description: "",
    color: [],
    status: true,
  });

  /* ---------------- Images ---------------- */
  const [currentImages, setCurrentImages] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removeImages, setRemoveImages] = useState<string[]>([]);

  /* ---------------- State ---------------- */
  const [loading, setLoading] = useState(false);

  /* ======================================================
     Fetch Product Detail
  ====================================================== */

  useEffect(() => {
    if (!open || !id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/detail/${id}`);
        if (!res.ok) throw new Error("Fetch failed");

        const json = await res.json();
        const data = json.data;

        /* Form */
        setForm({
          name: data.name,
          price: data.price,
          categoryId: data.categoryId,
          description: data.description,
          color: data.color || [],
          status: data.status,
        });

        /* Images */
        setCurrentImages(data.image || {});
        setNewImages([]);
        setNewPreviews([]);
        setRemoveImages([]);

        /* Match category */
        const selected = items.find(
          (c) => c.id === data.categoryId,
        );

        if (selected) {
          setCategory(selected);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchDetail();
  }, [open, id, items]);

  /* ======================================================
     Image Handlers
  ====================================================== */

  const onImageChange = (files: FileList | null) => {
    if (!files) return;

    const arr = Array.from(files);

    setNewImages((prev) => [...prev, ...arr]);

    const urls = arr.map((f) => URL.createObjectURL(f));

    setNewPreviews((prev) => [...prev, ...urls]);
  };

  const removeOldImage = (key: string) => {
    setRemoveImages((prev) => [...prev, key]);

    setCurrentImages((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);

    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ======================================================
     Submit
  ====================================================== */

  const submit = async () => {
    if (!id) return;

    if (!category) {
      alert("Please select category");
      return;
    }

    try {
      setLoading(true);

      /* ---------------- Update Info ---------------- */

      await fetch(`/api/products/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          categoryId: category.id,
        }),
      });

      /* ---------------- Update Images (If Needed) ---------------- */

      if (newImages.length || removeImages.length) {
        const fd = new FormData();

        newImages.forEach((file) => {
          fd.append("image", file);
        });

        removeImages.forEach((key) => {
          fd.append("current_image", key);
        });

        await fetch(`/api/products/edit/${id}`, {
          method: "POST",
          body: fd,
        });
      }

      /* ---------------- Success ---------------- */

      onSuccess?.();
      setOpen(false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     UI
  ====================================================== */

  if (!open) return null;

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
              Edit Product
            </h2>
            <p className="text-xs text-gray-500">
              Update product information
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">

          {/* Name */}
          <Field
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Price */}
          <Field
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          {/* Category */}
          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-700">
              Category
            </label>

            <DropDown<CategoryResponse>
              placeholder="Select category"
              value={category}
              items={items}
              loading={catLoading}
              hasMore={hasMore}
              fetchMore={fetchMore}
              onChange={(val) => {
                setCategory(val);

                setForm((f) => ({
                  ...f,
                  categoryId: val?.id || 0,
                }));
              }}
            />

          </div>

          {/* Description */}
          <Field
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Images */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Images
            </label>

            <div className="mt-2 flex flex-wrap gap-3">

              {/* Old */}
              {Object.entries(currentImages).map(([key, url]) => (
                <div
                  key={key}
                  className="relative h-24 w-24 rounded-xl overflow-hidden border"
                >
                  <img
                    src={url}
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={() => removeOldImage(key)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-1.5"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* New */}
              {newPreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 rounded-xl overflow-hidden border"
                >
                  <img
                    src={src}
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full px-1.5"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-xl border border-dashed text-gray-400 hover:border-primary"
              >
                +
              </div>

            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => onImageChange(e.target.files)}
            />

          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">

            <div>
              <p className="text-sm font-medium text-gray-700">
                Active
              </p>
              <p className="text-xs text-gray-500">
                Enable / Disable product
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.checked })
              }
              className="h-5 w-5 accent-primary"
            />

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-3xl">

          <button
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-black shadow hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
}

/* ======================================================
   Field Component
====================================================== */

function Field({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">

      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition
        focus:ring-2 focus:ring-primary/20 focus:border-primary border-gray-300"
      />

    </div>
  );
}
