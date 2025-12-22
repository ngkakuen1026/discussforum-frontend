import { Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostDraftType } from "../../types/postTypes";
import { useNavigate } from "@tanstack/react-router";

interface PostDraftCardProps {
  draft: PostDraftType;
  isSelected: boolean;
  selectMode: boolean;
  toggleSelection: (id: number) => void;
  getCategoryName: (id: number) => string;
}

const PostDraftCard = ({
  draft,
  isSelected,
  selectMode,
  toggleSelection,
  getCategoryName,
}: PostDraftCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`relative flex justify-between p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500 transition ${
        isSelected ? "ring-2 ring-cyan-500" : ""
      }`}
    >
      <div className="flex gap-4 items-center">
        {selectMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelection(draft.id)}
            className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2"
          />
        )}
        <div>
          <h3 className="text-xl font-bold text-white">
            {draft.title || "Untitled Draft"}
          </h3>
          <div className="flex flex-row mt-2 text-sm gap-2 text-gray-400">
            <p className="text-sm">
              {draft.categoryId
                ? getCategoryName(Number(draft.categoryId))
                : "No Category Selected"}
            </p>
            <span>•</span>
            <p className="text-sm">
              Edited{" "}
              <span className="text-gray-200">
                {formatDistanceToNow(new Date(draft.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex text-white items-center justify-between gap-4">
        <button
          onClick={() =>
            navigate({
              to: "/add-post",
              search: { draftId: draft.id },
            })
          }
          className="relative group transition-all"
        >
          <Edit
            size={18}
            className="text-gray-400 hover:opacity-75 cursor-pointer"
          />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
            Edit selected draft
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostDraftCard;
