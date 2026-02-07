"use client";

import { Props } from "@/app/types/CreateProp";
import { useEffect, useState } from "react";



type Errors = Partial<Record<"name" | "image", string>>;

export default function CategoryCreateDialog({
  open,
  setOpen,
  onSuccess,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: "",
    image: null as File | null,
    status: true,
  });

  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 200);
  }, [open]);

  if (!mounted) return null;

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.image) e.image = "Image is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("image", form.image!);
    fd.append("status", String(form.status));

    try {
      setLoading(true);
      const res = await fetch("/api/category/create", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (data?.status === "success") {
        setOpen(false);
        setForm({ name: "", image: null, status: true });
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-800">
            Add Category
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit}>
          {/* Body */}
          <div className="space-y-4 px-6 py-5">
            {/* Name */}
            <Field
              label="Category name"
              value={form.name}
              error={errors.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Image
              </label>

              <label
                htmlFor="image"
                className="
      flex h-32 w-32 cursor-pointer items-center justify-center
      rounded-xl border border-dashed border-gray-300
      bg-gray-50 text-gray-400
      hover:border-primary hover:text-primary
      transition
    "
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-sm">Upload</span>
                )}
              </label>

              {errors.image && (
                <p className="mt-1 text-xs text-red-500">{errors.image}</p>
              )}
            </div>

            {/* Image upload */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setForm((p) => ({ ...p, image: file }));
                  setPreview(URL.createObjectURL(file));
                  setErrors((p) => ({ ...p, image: undefined }));
                }}
                className="hidden"
                id="image"
              />
              {errors.image && (
                <p className="mt-1 text-xs text-red-500">{errors.image}</p>
              )}
            </div>

            {/* Status */}
            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) =>
                  setForm((p) => ({ ...p, status: e.target.checked }))
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Active
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="
                inline-flex items-center gap-2
                rounded-xl bg-primary/10 px-5 py-2
                text-sm font-medium text-primary
                hover:bg-primary/20
                disabled:opacity-50
              "
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
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
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-2 text-sm outline-none
          focus:ring-2 focus:ring-primary/20
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
