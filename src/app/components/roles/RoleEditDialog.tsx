
import { EditProps } from "@/app/types/EditProps";
import { RoleRequest } from "@/app/types/request/RoleRequest";
import { useEffect, useState } from "react";

type Errors = Partial<Record<"name", string>>;

export default function RoleAddDialog({
  open,
  setOpen,
  onSuccess,
  id,
}: EditProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    if (open) setMounted(true);
    else setTimeout(() => setMounted(false), 300);
  }, [open]);

  if (!mounted) return null;

  useEffect(() => {

  }, []);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => ({ ...p, [k]: undefined }));
    };

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: RoleRequest = {
      name: form.name,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/roles/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data?.status == "success") {
        setOpen(false);
        onSuccess?.();
        setForm({ name: "" });
      }
    } catch (error: unknown) {
      console.log(error);
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
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Create Role</h2>
            <p className="text-xs text-gray-500">Add a new role</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="space-y-6 px-6 py-6">
          <Field
            label="Role Name"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
          />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-3xl">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={submit}
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-black shadow-sm transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Input Field ---------------- */
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
          focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
