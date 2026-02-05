import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-2xl shadow-sm">
      {/* Page info */}
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-700">{page}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2 border border-gray-300 rounded-lg text-gray-600 
                     hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 border border-gray-300 rounded-lg text-gray-600 
                     hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
