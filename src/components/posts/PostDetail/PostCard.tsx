import { ThumbsUp, ThumbsDown, Ban, ArrowLeft } from "lucide-react";
import type { PostType } from "../../../types/postTypes";
import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../../../utils/dateUtils";
import SafeHTML from "../../SafeHTML";
import PostActions from "./PostActions";
import { useBlockedUsers } from "../../../context/BLockedUserContext";
import { useState } from "react";
import { getUsernameColor } from "../../../utils/userUtils";

interface PostCardProps {
  post: PostType;
  withAuth: (action: () => void) => () => void;
  userVote: number | null;

  postUpvotes: number;
  postDownvotes: number;
  upvote: () => void;
  downvote: () => void;
  upvotePending: boolean;
  downvotePending: boolean;
  onShowCommentPopup: () => void;
  onShowReportPopup: () => void;
}

const PostCard = ({
  post,
  withAuth,
  postUpvotes,
  postDownvotes,
  userVote,
  upvote,
  downvote,
  upvotePending,
  downvotePending,
  onShowCommentPopup,
  onShowReportPopup,
}: PostCardProps) => {
  const { isBlocked } = useBlockedUsers();
  const [showBlockedContent, setShowBlockedContent] = useState(false);

  const blocked = isBlocked(post.author_id);

  return (
    <div className="col-span-9 flex flex-col relative">
      {blocked && !showBlockedContent && (
        <div
          onClick={() => setShowBlockedContent(true)}
          className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm rounded-lg hover:border hover:border-gray-700 z-20 flex items-center justify-center cursor-pointer hover:bg-gray-900/80 transition"
        >
          <div className="text-center p-8">
            <Ban size={48} className="text-red-500 mx-auto mb-4" />
            <div className="flex flex-row gap-2 items-center justify-center">
              <p className="text-gray-300 text-xl font-bold ">Blocked User -</p>
              <p
                className={`text-xl ${getUsernameColor({
                  author_is_admin: post.author_is_admin,
                  author_gender: post.author_gender,
                })}`}
              >
                {post.author_username}
                {post.author_is_admin && (
                  <span className=" ml-2 text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                    Admin
                  </span>
                )}
              </p>
            </div>

            <p className="text-gray-500 text-sm mt-4 hover:text-gray-200">
              Tap to view content
            </p>
          </div>
        </div>
      )}

      <div
        className={blocked && !showBlockedContent ? "blur-md opacity-60" : ""}
      >
        {/* Header (date + actions) */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mt-1">
              #1 Posted on: {formatDate(post.created_at)} (
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
              )
            </p>
          </div>

          <PostActions
            withAuth={withAuth}
            postId={post.id}
            onShowCommentPopup={onShowCommentPopup}
            onShowReportPopup={onShowReportPopup}
          />
        </div>

        {/* Content */}
        <div
          className={`whitespace-pre-wrap break-all text-white text-base leading-relaxed mb-6 ${blocked && !showBlockedContent ? "hidden" : ""}`}
        >
          <SafeHTML
            html={post.content}
            className="text-white text-base leading-relaxed mb-4"
          />

          {/* Hide again button */}
          {blocked && showBlockedContent && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowBlockedContent(false)}
                className="text-sm text-gray-400 hover:text-white cursor-pointer flex items-center gap-0.5 mx-auto"
              >
                <ArrowLeft size={18} />
                Hide content again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={withAuth(() => upvote())}
          disabled={upvotePending || downvotePending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
            userVote === 1
              ? "bg-green-900/80 text-green-400 ring-2 ring-green-500 shadow-lg shadow-green-500/20 cursor-not-allowed"
              : "text-green-400 hover:bg-green-900/40"
          } ${userVote === -1 ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <ThumbsUp
            size={18}
            className={userVote === 1 ? "fill-green-400" : ""}
          />
          <span className="tabular-nums">{postUpvotes}</span>
        </button>

        <button
          onClick={withAuth(() => downvote())}
          disabled={upvotePending || downvotePending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
            userVote === -1
              ? "bg-red-900/80 text-red-400 ring-2 ring-red-500 shadow-lg shadow-red-500/20 cursor-not-allowed"
              : "text-red-400 hover:bg-red-900/40"
          } ${userVote === 1 ? "cursor-not-allowed opacity-70" : ""}`}
        >
          <ThumbsDown
            size={18}
            className={userVote === -1 ? "fill-red-400" : ""}
          />
          <span className="tabular-nums">{postDownvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
