import { ArrowLeft, ArrowRight } from "lucide-react";

interface PostListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  inputPage: string;
  setInputPage: (value: string) => void;
}

const PostListPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  inputPage,
  setInputPage,
}: PostListPaginationProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* First Page */}
        {totalPages > 9 && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
          >
            First
          </button>
        )}

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2.5 flex items-center gap-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {Array.from({ length: Math.min(9, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 9 && currentPage > 5) {
              pageNum = Math.max(currentPage - 4, 1) + i;
              if (pageNum > totalPages) return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          }).filter(Boolean)}

          {/* Ellipsis + Last Page */}
          {totalPages > 9 && currentPage < totalPages - 4 && (
            <>
              <span className="text-gray-500 px-2">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm font-medium cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2.5 flex items-center gap-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
        >
          Next
          <ArrowRight size={16} />
        </button>

        {/* Last Page */}
        {totalPages > 9 && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
          >
            Last
          </button>
        )}

        {/* Direct Page Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value.replace(/[^\d]/g, ""))}
            onBlur={() => {
              const num = Number(inputPage);
              if (
                inputPage &&
                num >= 1 &&
                num <= totalPages &&
                num !== currentPage
              ) {
                onPageChange(num);
              } else {
                setInputPage(currentPage.toString());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const num = Number(inputPage);
                if (
                  inputPage &&
                  num >= 1 &&
                  num <= totalPages &&
                  num !== currentPage
                ) {
                  onPageChange(num);
                } else {
                  setInputPage(currentPage.toString());
                }
              }
            }}
            className="w-16 px-2 py-1.5 rounded border border-gray-600 bg-gray-900 text-center text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder={currentPage.toString()}
          />
          <span className="text-gray-500 text-sm">/ {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default PostListPagination;
