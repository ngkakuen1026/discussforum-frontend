import { ArrowLeft, ArrowRight } from "lucide-react";

interface PublicUserPostListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PublicUserPostListPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PublicUserPostListPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 ">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2.5 flex items-center gap-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm cursor-pointer"
      >
        <ArrowLeft size={16} />
        Previous
      </button>

      <div className="flex gap-2">
        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
          let pageNum = i + 1;
          if (totalPages > 7 && currentPage > 4) {
            pageNum = Math.max(currentPage - 3, 1) + i;
            if (pageNum > totalPages) return null;
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                currentPage === pageNum
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {pageNum}
            </button>
          );
        }).filter(Boolean)}

        {totalPages > 7 && currentPage < totalPages - 3 && (
          <>
            <span className="text-gray-500 px-2">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-9 h-9 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm font-medium "
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2.5 flex items-center gap-1 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm cursor-pointer"
      >
        Next
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default PublicUserPostListPagination;
