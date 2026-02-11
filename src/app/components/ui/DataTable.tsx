"use client";

import { Column } from "@/app/types/Column";

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  emptyText?: string;
};

export default function DataTable<T>({
  data,
  columns,
  onRowClick,
  emptyText = "No data found",
}: Props<T>) {
  return (
    <div className="relative overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-50/80 backdrop-blur border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {data.length ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-all duration-200 ${
                    onRowClick ? "cursor-pointer hover:bg-blue-50/60" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      onClick={(e) =>
                        col.clickable === false && e.stopPropagation()
                      }
                      className="px-6 py-4 text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        {col.render(row)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-sm">{emptyText}</span>
                    <span className="text-xs">Try creating a new product</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
