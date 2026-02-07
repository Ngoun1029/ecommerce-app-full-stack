"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = {
  id: number | string;
  name: string;
};

type Props<T extends Item> = {
  label?: string;
  placeholder?: string;
  value?: T | null;
  items: T[];
  loading: boolean;
  hasMore: boolean;
  fetchMore: () => void;
  onChange: (item: T) => void;
};

export default function DropDown<T extends Item>({
  label,
  placeholder = "Select",
  value,
  items,
  loading,
  hasMore,
  fetchMore,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Load when opened */
  useEffect(() => {
    if (open) fetchMore();
  }, [open, fetchMore]);

  /* Close outside */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Infinite Scroll */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      fetchMore();
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      {/* Label */}
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-600">
          {label}
        </label>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <span
          className={`${
            value ? "text-gray-800" : "text-gray-400"
          }`}
        >
          {value?.name || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          onScroll={handleScroll}
          className="absolute z-30 mt-2 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {/* Items */}
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`cursor-pointer px-4 py-2 text-sm transition hover:bg-blue-50 ${
                value?.id === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="py-2 text-center text-sm text-gray-400">
              Loading...
            </div>
          )}

          {/* End */}
          {!hasMore && !loading && (
            <div className="py-2 text-center text-xs text-gray-400">
              No more data
            </div>
          )}
        </div>
      )}
    </div>
  );
}
