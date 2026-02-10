"use client";

import { Props } from "@/app/types/CreateProp";
import { useEffect, useRef, useState } from "react";
import { usePagination } from "../../../../utils/usePagination";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";
import DropDown from "../ui/DropDown";

type Errors = Partial<Record<"name" | "price" | "category" | "image", string>>;

export default function ProductAddDialog({ open, setOpen }: Props) {
  const { items, loading, hasMore, fetchMore } =
    usePagination<CategoryResponse>("/api/categories/lists", 10);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    status: true,
    colors: "",
  });

  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]); 

  /* ---------------- Mount Animation ---------------- */
  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 200);
  }, [open]);

  if (!mounted) return null;

  /* ---------------- Image Handling ---------------- */
  const openFilePicker = () => fileInputRef.current?.click();

  const onImagesChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);

    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Submit ---------------- */
  const submit = async () => {
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: "Product name is required" });
      return;
    }

    if (!form.price) {
      setErrors({ price: "Price is required" });
      return;
    }

    if (!category) {
      setErrors({ category: "Category is required" });
      return;
    }

    if (!images.length) {
      setErrors({ image: "At least one image is required" });
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("category_id", String(category.id));
      fd.append("description", form.description);
      fd.append("status", String(form.status));

      form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
        .forEach((c) => fd.append("color[]", c));

      images.forEach((img) => fd.append("image[]", img));

      const res = await fetch("/api/products/create", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Create failed");

      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */
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
            <h2 className="text-lg font-semibold text-gray-900">Add Product</h2>
            <p className="text-xs text-gray-500">Create a new product</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {/* Body */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              <Field
                label="Product Name"
                value={form.name}
                error={errors.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />

              <Field
                label="Price"
                type="number"
                value={form.price}
                error={errors.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
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
                  loading={loading}
                  hasMore={hasMore}
                  fetchMore={fetchMore}
                  onChange={setCategory}
                />

                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Field
                label="Colors"
                placeholder="red, blue, green"
                value={form.colors}
                onChange={(e) =>
                  setForm((f) => ({ ...f, colors: e.target.value }))
                }
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Images
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* Upload */}
                  <div
                    onClick={openFilePicker}
                    className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 hover:border-primary transition"
                  >
                    <span className="text-xs text-gray-400">Upload</span>

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100">
                      Add
                    </div>
                  </div>

                  {/* Preview */}
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-2xl border"
                    >
                      <img
                        src={src}
                        alt="preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {errors.image && (
                  <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => onImagesChange(e.target.files)}
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Active Status
                  </p>
                  <p className="text-xs text-gray-500">
                    Enable or disable this product
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.checked }))
                  }
                  className="h-5 w-5 accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-black shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Input ---------------- */

function Field({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <input
        {...props}
        value={props.value ?? ""}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition
          focus:ring-2 focus:ring-primary/20
          ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
