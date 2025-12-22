import { Flag, MessageCircle, Pin, Share2 } from "lucide-react";
import { useBookmark } from "../../../context/BookmarkContext";

interface PostActionProps {
  withAuth: (action: () => void) => () => void;
  postId: number;
  onShowCommentPopup: () => void;
  onShowReportPopup: () => void;
}

const PostActions = ({
  withAuth,
  postId,
  onShowCommentPopup,
  onShowReportPopup,
}: PostActionProps) => {
  const { isBookmarked, toggleBookmark, isPending } = useBookmark();
  return (
    <div className="flex gap-2 text-gray-400">
      <button
        onClick={withAuth(() => toggleBookmark(postId))}
        disabled={isPending}
        className="relative group cursor-pointer"
      >
        {isBookmarked(postId) ? (
          <Pin
            size={18}
            className="fill-yellow-500 text-yellow-500 drop-shadow-md"
          />
        ) : (
          <Pin
            size={18}
            className="hover:text-yellow-500 hover:fill-yellow-500/30 transition"
          />
        )}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          {isBookmarked(postId) ? "Pinned (click to remove)" : "Click to pin"}
        </span>
      </button>
      <button
        onClick={withAuth(() => onShowCommentPopup())}
        className="relative group cursor-pointer"
      >
        <MessageCircle size={18} className="hover:text-cyan-500 transition" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Add a comment
        </span>
      </button>
      <button className="relative group cursor-pointer">
        <Share2 size={18} className="hover:text-white transition" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Share Post
        </span>
      </button>
      <button
        onClick={withAuth(() => onShowReportPopup())}
        className="relative group cursor-pointer"
      >
        <Flag size={18} className="hover:text-red-500 transition" />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
          Report Content
        </span>
      </button>
    </div>
  );
};

export default PostActions;
