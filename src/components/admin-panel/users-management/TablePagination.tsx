interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  itemsName: string;
}

const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage,
  itemsName,
}: TablePaginationProps) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-gray-400 font-medium text-lg mr-4">
        Page <span className="text-white">{currentPage}</span> •{" "}
        <span className="text-white">{totalItems}</span> {itemsName} total •
        Showing <span className="text-white">{itemsPerPage}</span> per page
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2.5 flex items-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer border border-gray-700"
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
                className={`w-10 h-10 rounded-lg text-sm font-medium transition cursor-pointer border border-gray-700 ${
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
                className="w-10 h-10 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 text-sm font-medium "
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm cursor-pointer border border-gray-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
