"use client";

import { DetailProps } from "@/app/types/DetailProps";
import { useEffect, useState } from "react";

type UserDetail = {
  id: number;
  name: string;
  email: string;
  role: string;
  image: string | null;
};

export default function UserDetailDialog({ open, setOpen, id }: DetailProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (!id || !open) return;

    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/detail/${id}`);
        const json = await res.json();

        if (json.status === "success") {
          setUser(json.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">User Detail</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {loading ? (
            <UserDetailSkeleton />
          ) : user ? (
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-full overflow-hidden border">
                <img
                  src={user.image ?? '/public/next.svg'}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              {/* Role */}
              <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-600">
                {user.role}
              </span>

              {/* Meta */}
              <div className="mt-4 w-full rounded-xl border bg-gray-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-medium text-gray-900">#{user.id}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">User not found</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function UserDetailSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <div className="h-24 w-24 rounded-full bg-gray-200" />
      <div className="h-4 w-40 rounded bg-gray-200" />
      <div className="h-3 w-56 rounded bg-gray-200" />
      <div className="h-6 w-20 rounded-full bg-gray-200 mt-2" />
    </div>
  );
}
