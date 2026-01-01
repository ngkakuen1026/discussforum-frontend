import { ListMinus, Trash2, RefreshCcw, X, MousePointer } from "lucide-react";
import type { BookmarkType } from "../../types/bookmarkTypes";

interface PinnedPostToolbarProps {
  selectMode: boolean;
  selectedPostIds: number[];
  bookmarks: BookmarkType[];
  unpinMultiplePinsMutation: { isPending: boolean };
  toggleSelectMode: () => void;
  selectAll: () => void;
  deleteSelected: () => void;
  refreshBookmarks: () => void;
}

const PinnedPostToolbar = ({
  selectMode,
  selectedPostIds,
  bookmarks,
  unpinMultiplePinsMutation,
  toggleSelectMode,
  selectAll,
  deleteSelected,
  refreshBookmarks,
}: PinnedPostToolbarProps) => {
  return (
    <div className="">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-white text-2xl font-bold">
          My Pinned Posts ({bookmarks.length}){" "}
        </h1>
        {selectMode ? (
          <div className="flex gap-2 ">
            <button
              onClick={selectAll}
              disabled={unpinMultiplePinsMutation.isPending}
              className="relative group transition-all"
            >
              <MousePointer
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                {selectedPostIds.length === bookmarks.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>

            <button
              onClick={deleteSelected}
              disabled={
                unpinMultiplePinsMutation.isPending ||
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
              onClick={refreshBookmarks}
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
            ? `${selectedPostIds.length} pinned ${selectedPostIds.length > 1 ? "posts" : "post"} selected`
            : `The post pinned`}
        </h2>
      </div>
    </div>
  );
};

export default PinnedPostToolbar;
