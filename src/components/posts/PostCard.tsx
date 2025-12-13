import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ThumbsUp, ThumbsDown, MessageCircle, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../../utils/dateUtils";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import PostTags from "./PostTags";
import type { PostType } from "../../types/postTypes";

interface PostCardProps {
  post: PostType;
  upvotes: string | number;
  downvotes: string | number;
  commentLength: number;
  categoryName: string;
  handleCategoryClick: (categoryId: number) => void;
  rightAction?: ReactNode;
}

const PostCard = ({
  post,
  upvotes,
  downvotes,
  commentLength,
  categoryName,
  handleCategoryClick,
  rightAction,
}: PostCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group relative border-b border-gray-800/80 last:border-b-0 hover:bg-white/5 transition-all duration-200 cursor-pointer">
      {/* hover effect on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-cyan-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-left" />

      <div className="px-4 py-6 mx-auto flex gap-6 relative">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <img
            src={getUserAvatar(post)}
            alt={post.author_username}
            className="w-20 h-20 rounded-full ring-2 ring-gray-800 group-hover:ring-cyan-500/50 transition-all"
          />
          <div className="flex flex-col items-center gap-4 text-xs text-gray-500">
            <div className="flex flex-row gap-4">
              <div className="flex items-center gap-1 text-green-400">
                <ThumbsUp size={16} />
                <span className="font-medium">{upvotes}</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <ThumbsDown size={16} />
                <span className="font-medium">{downvotes}</span>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex items-center gap-1 text-gray-300">
                <Eye size={16} />
                <span className="font-medium ">{post.views}</span>
              </div>

              <div className="flex items-center gap-1 text-blue-400">
                <MessageCircle size={16} />
                <span className="font-medium ">{commentLength}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex-1 min-w-0"
          onClick={() =>
            navigate({
              to: "/posts/$postId",
              params: { postId: post.id.toString() },
              search: { page: undefined },
            })
          }
        >
          <div className="flex items-center gap-3 text-sm">
            <span className={`font-semibold ${getUsernameColor(post)}`}>
              {post.author_username}
            </span>
            {post.author_is_admin && (
              <span
                className={`text-xs bg-yellow-600/80 px-2 py-0.5 rounded-lg ${getUsernameColor(post)}`}
              >
                Admin
              </span>
            )}
            <span className="text-gray-400">•</span>
            <time className="text-gray-400 hover:text-gray-300 transition">
              {formatDate(post.created_at)}
            </time>
            <span className="text-gray-400">•</span>
            <time className="text-gray-400 hover:text-gray-300 transition">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </time>
          </div>

          {/* Tags */}
          <div className="">
            <PostTags postId={post.id} pendingTagName={post.pending_tag_name} />
          </div>

          {/* Title */}
          <h3 className="mt-4 text-xl font-semibold text-white ">
            {post.title}
          </h3>
        </div>

        {/* Right: Category Pill and Custom Action */}
        <div className="hidden md:flex flex-col items-end justify-between min-w-40 h-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCategoryClick(post.category_id);
            }}
            className="relative group/pill"
          >
            <span className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 transition-all hover:scale-105  cursor-pointer">
              {categoryName}
            </span>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-cyan-300 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/pill:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-gray-800">
              Go to {categoryName}
            </span>
          </button>
          {rightAction && <div className="mt-4">{rightAction}</div>}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
