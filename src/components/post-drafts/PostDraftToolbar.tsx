import React from "react";
import { MousePointer, Trash2, X, ListMinus, RefreshCcw } from "lucide-react";
import type { PostDraftType } from "../../types/postTypes";

interface PostDraftToolbarProps {
  selectMode: boolean;
  selectedDraftIds: number[];
  drafts: PostDraftType[];
  deleteMultiplePostDraftsMutation: { isPending: boolean };
  toggleSelectMode: () => void;
  selectAll: () => void;
  deleteSelected: () => void;
  refreshPostDrafts: () => void;
}

const PostDraftToolbar: React.FC<PostDraftToolbarProps> = ({
  selectMode,
  selectedDraftIds,
  drafts,
  deleteMultiplePostDraftsMutation,
  toggleSelectMode,
  selectAll,
  deleteSelected,
  refreshPostDrafts,
}) => (
  <div className="">
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-white text-2xl font-bold">
        My draft ({drafts.length}/10)
      </h1>
      {selectMode ? (
        <div className="flex gap-2 ">
          <button
            onClick={selectAll}
            disabled={deleteMultiplePostDraftsMutation.isPending}
            className="relative group transition-all"
          >
            <MousePointer
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
              {selectedDraftIds.length === drafts.length
                ? "Deselect All"
                : "Select All"}
            </span>
          </button>
          <button
            onClick={deleteSelected}
            disabled={
              deleteMultiplePostDraftsMutation.isPending ||
              selectedDraftIds.length === 0
            }
            className="relative group transition-all"
          >
            <Trash2
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
              Delete ({selectedDraftIds.length})
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
            onClick={refreshPostDrafts}
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
          ? `${selectedDraftIds.length} ${selectedDraftIds.length > 1 ? "post drafts" : "post draft"} selected`
          : "The post drafts saved, can only save up to 10 drafts"}
      </h2>
    </div>
  </div>
);

export default PostDraftToolbar;
