import { useState, type ReactNode } from "react";
import type { BrowseHistoryType } from "../../types/browseHistoryTypes";
import { useNavigate } from "@tanstack/react-router";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { Eye, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import { formatDistanceToNow } from "date-fns";
import PostTags from "../posts/PostDetail/PostTags";
import { UserRoleTag } from "../UserRoleTag";

interface BrowseHistoryCardProps {
  browseHistory: BrowseHistoryType;
  upvotes: number;
  downvotes: number;
  commentLength: number;
  categoryName: string;
  handleCategoryClick: (categoryId: number) => void;
  rightAction?: ReactNode;
  selectMode: boolean;
  isSelected: boolean;
  toggleSelection: (browseHistoryId: number) => void;
}

const BrowseHistoryCard = ({
  browseHistory,
  upvotes,
  downvotes,
  commentLength,
  categoryName,
  handleCategoryClick,
  rightAction,
  selectMode,
  isSelected,
  toggleSelection,
}: BrowseHistoryCardProps) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState<
    null | "upvotes" | "downvotes" | "views" | "comments"
  >(null);

  return (
    <div
      className="group relative border-b border-gray-800/80 last:border-b-0 hover:bg-white/5 transition-all duration-200 cursor-pointer"
      onClick={() =>
        navigate({
          to: "/posts/$postId",
          params: { postId: browseHistory.post_id.toString() },
          search: { page: undefined },
        })
      }
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-cyan-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_180px] gap-8 px-4 py-6 items-start">
        <div className="flex flex-row items-center">
          {selectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleSelection(browseHistory.post_id)}
              className="w-5 h-5 text-gray-500 rounded border-gray-600 focus:ring-gray-400 focus:ring-2 mr-4"
            />
          )}
          <div className="flex flex-col items-center">
            {" "}
            <img
              src={getUserAvatar(browseHistory)}
              alt={browseHistory.author_username}
              className="w-20 h-20 rounded-full ring-2 ring-gray-800 group-hover:ring-cyan-500/50 transition-all mb-6"
            />
            <div className="space-y-4 text-sm">
              <div className="flex justify-center gap-6">
                {/* Upvotes */}
                <div
                  className="relative group"
                  onMouseEnter={() => setShowTooltip("upvotes")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <div className="flex flex-row items-center gap-1 text-green-400 group-hover:text-green-200 transition">
                    <ThumbsUp size={16} />
                    <span>{upvotes}</span>
                  </div>
                  {showTooltip === "upvotes" && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                      {upvotes} {upvotes > 1 ? "upvotes" : "upvote"}
                    </span>
                  )}
                </div>

                {/* Downvotes */}
                <div
                  className="relative group"
                  onMouseEnter={() => setShowTooltip("downvotes")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <div className="flex flex-row items-center gap-1 text-red-400 group-hover:text-red-200 transition">
                    <ThumbsDown size={16} />
                    <span>{downvotes}</span>
                  </div>
                  {showTooltip === "downvotes" && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                      {downvotes} {downvotes > 1 ? "downvotes" : "downvote"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <div
                  className="relative group"
                  onMouseEnter={() => setShowTooltip("views")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <div className="flex flex-row items-center gap-1 text-gray-400 group-hover:text-white transition">
                    <Eye size={16} />
                    {browseHistory.post_view}
                  </div>
                  <span
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50 ${showTooltip === "views" ? "opacity-100" : "opacity-0"}`}
                  >
                    {browseHistory.post_view}{" "}
                    {browseHistory.post_view > 1 ? "Visits" : "Visit"}
                  </span>
                </div>

                <div
                  className="relative group"
                  onMouseEnter={() => setShowTooltip("comments")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <div className="flex flex-row items-center gap-1 text-blue-400 font-medium group-hover:text-blue-200 transition">
                    <MessageCircle size={16} />
                    <span>{commentLength}</span>
                  </div>
                  <span
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50 ${showTooltip === "comments" ? "opacity-100" : "opacity-0"}`}
                  >
                    {commentLength} {commentLength > 1 ? "Comments" : "Comment"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Main Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm text-gray-400 ">
            <span
              className={`font-semibold ${getUsernameColor(browseHistory)}`}
            >
              {browseHistory.author_username}
            </span>
            <UserRoleTag user={browseHistory} />
            <span className="text-gray-400">•</span>
            <time className="text-gray-400 hover:text-gray-300 transition">
              {formatDate(browseHistory.post_created_at)}
            </time>
            <span className="text-gray-400">•</span>
            <time className="text-gray-400 hover:text-gray-300 transition">
              {browseHistory.post_created_at
                ? formatDistanceToNow(new Date(browseHistory.post_created_at), {
                    addSuffix: true,
                  })
                : "Recently"}
            </time>
          </div>

          <PostTags
            postId={browseHistory.post_id}
            pendingTagName={browseHistory.post_pending_tag_name}
          />

          <h3 className="text-xl font-semibold text-white line-clamp-3">
            {browseHistory.post_title}
          </h3>
        </div>

        <div className="hidden md:flex flex-col items-end justify-start">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCategoryClick(browseHistory.category_id);
            }}
            className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 hover:scale-105 transition cursor-pointer"
          >
            {categoryName}
          </button>

          {rightAction && <div className="mt-6">{rightAction}</div>}
        </div>
      </div>
    </div>
  );
};

export default BrowseHistoryCard;
