"use client";

import { Props } from "@/app/types/CreateProp";
import { useEffect, useRef, useState } from "react";

type Errors = Partial<Record<"name" | "image", string>>;

export default function CategoryCreateDialog({
  open,
  setOpen,
  onSuccess,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    image: null as File | null,
    status: true,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ---------------- Mount Animation ---------------- */
  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 200);
  }, [open]);

  if (!mounted) return null;

  /* ---------------- Open File Picker ---------------- */
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };


  const validate = () => {
    const e: Errors = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.image) e.image = "Image is required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  /* ---------------- Image Change ---------------- */
  const onImageChange = (file: File | null) => {
    setForm((f) => ({ ...f, image: file }));

    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  };

  /* ---------------- Submit ---------------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("image", form.image!);
      fd.append("status", String(form.status));

      const res = await fetch("/api/categories/create", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Create failed");

      // Reset
      setForm({
        name: "",
        image: null,
        status: true,
      });

      setImagePreview(null);

      onSuccess?.();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Category
            </h2>
            <p className="text-xs text-gray-500">Create a new category</p>
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
          {/* Name */}
          <Field
            label="Category Name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category Image
            </label>

            <div className="flex items-center gap-5">
              {/* Preview */}
              <div
                onClick={openFilePicker}
                className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50 transition hover:border-primary"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Upload</span>
                )}

                {/* Hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 transition group-hover:opacity-100">
                  Upload
                </div>
              </div>

              {/* Hint */}
              <div className="text-xs text-gray-500 leading-relaxed">
                Click image to upload <br />
                JPG / PNG / WEBP
              </div>
            </div>

            {errors.image && (
              <p className="mt-1 text-xs text-red-500">{errors.image}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-xl border bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Active Status</p>
              <p className="text-xs text-gray-500">
                Enable or disable this category
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.checked,
                }))
              }
              className="h-5 w-5 accent-primary"
            />
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
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium hover:text-gray-700 text-black shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Create Category"}
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
          focus:border-primary
          ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
