import { ListMinus, MousePointer, RefreshCcw, Trash2, X } from "lucide-react";
import type { BrowseHistoryType } from "../../types/browseHistoryTypes";

interface BrowseHistoryProps {
  selectMode: boolean;
  selectedPostIds: number[];
  browsingHistories: BrowseHistoryType[];
  deleteMultipleBrowsingHistoriesMutation: { isPending: boolean };
  toggleSelectMode: () => void;
  selectAll: () => void;
  deleteSelected: () => void;
  refreshBrowsingHistories: () => void;
}

const BrowseHistoryToolbar = ({
  selectMode,
  selectedPostIds,
  browsingHistories,
  deleteMultipleBrowsingHistoriesMutation,
  toggleSelectMode,
  selectAll,
  deleteSelected,
  refreshBrowsingHistories,
}: BrowseHistoryProps) => {
  return (
    <div className="">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-white text-2xl font-bold">My Browsing History</h1>
        {selectMode ? (
          <div className="flex gap-2 ">
            <button
              onClick={selectAll}
              disabled={deleteMultipleBrowsingHistoriesMutation.isPending}
              className="relative group transition-all"
            >
              <MousePointer
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                {selectedPostIds.length === browsingHistories.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>

            <button
              onClick={deleteSelected}
              disabled={
                deleteMultipleBrowsingHistoriesMutation.isPending ||
                selectedPostIds.length === 0
              }
              className="relative group transition-all"
            >
              <Trash2
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Delete ({selectedPostIds.length})
              </span>
            </button>
            <button
              onClick={toggleSelectMode}
              className="relative group transition-all"
            >
              <X
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Cancel
              </span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2 ">
            <button
              onClick={toggleSelectMode}
              className="relative group transition-all"
            >
              <ListMinus
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Select multiple to delete
              </span>
            </button>
            <button
              onClick={refreshBrowsingHistories}
              className="relative group transition-all"
            >
              <RefreshCcw
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Refresh
              </span>
            </button>
          </div>
        )}
      </div>
      <div>
        <h2 className={`text-gray-400 mt-2`}>
          {selectMode
            ? `${selectedPostIds.length} ${selectedPostIds.length > 1 ? "browsing history records" : "browsing history record"} selected`
            : "The post visited"}
        </h2>
      </div>
    </div>
  );
};

export default BrowseHistoryToolbar;
