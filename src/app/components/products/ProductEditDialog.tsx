"use client";

import { EditProps } from "@/app/types/EditProps";
import { ProductUpdateRequest } from "@/app/types/request/ProductRequest";
import { CategoryResponse } from "@/app/types/response/CategoryResponse";

import { useEffect, useRef, useState } from "react";

import { usePagination } from "../../../../utils/usePagination";
import DropDown from "../ui/DropDown";

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

  /* ---------------- Color ---------------- */
  const [colorInput, setColorInput] = useState("");

  const addColor = () => {
    const value = colorInput.trim().toLowerCase();
    if (!value) return;

    if (form.color.includes(value)) return;

    setForm((prev) => ({
      ...prev,
      color: [...prev.color, value],
    }));

    setColorInput("");
  };

  const removeColor = (index: number) => {
    setForm((prev) => ({
      ...prev,
      color: prev.color.filter((_, i) => i !== index),
    }));
  };

  /* ---------------- Images ---------------- */
  const [currentImages, setCurrentImages] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removeImages, setRemoveImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  /* ======================================================
     Fetch Product Detail
  ====================================================== */

  useEffect(() => {
    if (!open || !id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/detail/${id}`);
        const json = await res.json();
        const data = json.data;

        setForm({
          name: data.name,
          price: data.price,
          categoryId: data.categoryId,
          description: data.description,
          color: data.color || [],
          status: data.status,
        });

        setCurrentImages(data.image || {});
        setNewImages([]);
        setNewPreviews([]);
        setRemoveImages([]);

        const selected = items.find((c) => c.id === data.categoryId);
        if (selected) setCategory(selected);

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

      await fetch(`/api/products/edit/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: category.id,
        }),
      });

      if (newImages.length || removeImages.length) {
        const fd = new FormData();

        newImages.forEach((file) => fd.append("image", file));
        removeImages.forEach((key) =>
          fd.append("current_image", key)
        );

        await fetch(`/api/products/edit/${id}`, {
          method: "POST",
          body: fd,
        });
      }

      onSuccess?.();
      setOpen(false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex justify-between px-6 py-5 border-b">
          <h2 className="font-semibold">Edit Product</h2>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-6">

          <Field
            label="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Field
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          {/* Category */}
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

          <Field
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* ✅ COLOR SECTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Colors</label>

            <div className="flex gap-2">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor();
                  }
                }}
                placeholder="red, #000, blue"
                className="flex-1 border rounded-xl px-4 py-2"
              />

              <button
                onClick={addColor}
                className="px-4 bg-primary rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.color.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: c }}
                  />

                  {c}

                  <button
                    onClick={() => removeColor(i)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-wrap gap-3">
            {Object.entries(currentImages).map(([key, url]) => (
              <img key={key} src={url} className="h-20 w-20" />
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button onClick={() => setOpen(false)}>Cancel</button>
          <button onClick={submit}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* Field */
function Field({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label>{label}</label>
      <input {...props} className="w-full border px-3 py-2 rounded-xl" />
    </div>
  );
}