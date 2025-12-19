interface PostPaginationProps {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  onPageChange: (page: number) => void;
}

const PostPagination = ({
  currentPage,
  totalPages,
  totalComments,
  onPageChange,
}: PostPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-400 font-medium">
        Page {currentPage} • {totalComments + 1} replies total
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
        >
          ← Previous
        </button>

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

          {totalPages > 9 && currentPage < totalPages - 4 && (
            <>
              <span className="text-gray-500 px-2">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm font-medium"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default PostPagination;
