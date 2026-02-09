import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};
export function Pagination({ page, totalPages, onChange }: Props) {
  return (
    <div
      className="flex items-center justify-between px-6 py-4 
                    border-t border-gray-100 bg-white rounded-b-3xl"
    >
      {/* Info */}
      <p className="text-sm text-gray-500">
        Showing page <span className="font-medium text-gray-800">{page}</span>{" "}
        of <span className="font-medium text-gray-800">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-2.5 rounded-xl border border-gray-200
                     text-gray-500 hover:text-blue-600
                     hover:bg-blue-50 disabled:opacity-40
                     transition"
        >
          <FaChevronLeft />
        </button>

        <span
          className="px-4 py-1.5 text-sm rounded-full 
                         bg-blue-50 text-blue-600 font-medium"
        >
          {page}
        </span>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-2.5 rounded-xl border border-gray-200
                     text-gray-500 hover:text-blue-600
                     hover:bg-blue-50 disabled:opacity-40
                     transition"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
