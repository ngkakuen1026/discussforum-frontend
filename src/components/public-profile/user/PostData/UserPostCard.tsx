import { formatDistanceToNow } from "date-fns";
import type { PostType } from "../../../../types/postTypes";
import { formatDate } from "../../../../utils/dateUtils";
import { getUserAvatar } from "../../../../utils/userUtils";
import SafeHTML from "../../../SafeHTML";
import PostTags from "../../../posts/PostDetail/PostTags";
import { Eye, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

interface UserPostCardProps {
  publicUserPost: PostType;
  upvotes: number;
  downvotes: number;
  commentLength: number;
  handleCategoryClick: (categoryId: number) => void;
  categoryName: string;
}

const UserPostCard = ({
  publicUserPost,
  upvotes,
  downvotes,
  commentLength,
  handleCategoryClick,
  categoryName,
}: UserPostCardProps) => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState<
    null | "upvotes" | "downvotes" | "views" | "comments"
  >(null);

  return (
    <div className="rounded-2xl bg-gray-800/60 border border-gray-800/80 shadow-lg p-6 hover:bg-white/5 transition-all duration-300">
      {/* Header */}
      <div
        onClick={() =>
          navigate({
            to: "/posts/$postId",
            params: { postId: publicUserPost.id.toString() },
            search: { page: undefined },
          })
        }
        className="cursor-pointer"
      >
        <div className="flex flex-row justify-between border-b border-gray-700/70 pb-4">
          {/* User Image, Title, Tags, Category */}
          <div className="flex flex-row gap-4 items-start">
            <img
              src={getUserAvatar(publicUserPost)}
              alt={publicUserPost.author_username}
              className="w-14 h-14 object-cover rounded-full ring-2 ring-gray-800 group-hover:ring-cyan-500/50 transition-all"
            />
            <div className="flex flex-col">
              <div className="flex flex-row gap-3 items-center">
                <h4 className="text-xl font-bold text-gray-200">
                  {publicUserPost.title}
                </h4>
              </div>

              <div className="flex gap-4 text-sm mt-1">
                <time className="text-gray-400 hover:text-gray-300 transition">
                  {formatDate(publicUserPost.created_at)}
                </time>
                <span className="text-gray-400">•</span>
                <time className="text-gray-400 hover:text-gray-300 transition">
                  {formatDistanceToNow(new Date(publicUserPost.created_at), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            </div>
          </div>

          {/* Category Button */}
          <div className="flex items-start">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick(publicUserPost.category_id);
              }}
              className="px-3 py-1.5 text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 hover:scale-105 transition cursor-pointer"
            >
              {categoryName}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          onClick={() =>
            navigate({
              to: "/posts/$postId",
              params: { postId: publicUserPost.id.toString() },
              search: { page: undefined },
            })
          }
        >
          <SafeHTML
            html={publicUserPost.content}
            className="text-gray-300 py-4 border-b border-gray-700/70 mb-4  cursor-pointer"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between gap-6 text-sm text-gray-400">
        <div className="flex gap-6 ">
          {/* Upvotes */}
          <div
            className="relative group"
            onMouseEnter={() => setShowTooltip("upvotes")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="flex items-center gap-1 text-green-400 group-hover:text-green-200 transition">
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
            <div className="flex items-center gap-1 text-red-400 group-hover:text-red-200 transition">
              <ThumbsDown size={16} />
              <span>{downvotes}</span>
            </div>
            {showTooltip === "downvotes" && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                {downvotes} {downvotes > 1 ? "downvotes" : "downvote"}
              </span>
            )}
          </div>

          {/* Views */}
          <div
            className="relative group"
            onMouseEnter={() => setShowTooltip("views")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="flex items-center gap-1 text-gray-400 group-hover:text-white transition">
              <Eye size={16} />
              {publicUserPost.views}
            </div>
            {showTooltip === "views" && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                {publicUserPost.views}{" "}
                {publicUserPost.views > 1 ? "Visits" : "Visit"}
              </span>
            )}
          </div>

          {/* Comments */}
          <div
            className="relative group"
            onMouseEnter={() => setShowTooltip("comments")}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="flex items-center gap-1 text-blue-400 font-medium group-hover:text-blue-200 transition">
              <MessageCircle size={16} />
              <span>{commentLength}</span>
            </div>
            {showTooltip === "comments" && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                {commentLength} {commentLength > 1 ? "Comments" : "Comment"}
              </span>
            )}
          </div>
        </div>

        <PostTags
          postId={publicUserPost.id}
          pendingTagName={publicUserPost.pending_tag_name}
        />
      </div>
    </div>
  );
};

export default UserPostCard;
