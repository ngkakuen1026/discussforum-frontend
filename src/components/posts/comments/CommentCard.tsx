import { formatDistanceToNow } from "date-fns";
import { formatDate } from "../../../utils/dateUtils";
import { ThumbsUp, ThumbsDown, Reply, Ban, ArrowLeft } from "lucide-react";
import type { CommentType } from "../../../types/commentTypes";
import { getUsernameColor } from "../../../utils/userUtils";
import SafeHTML from "../../SafeHTML";
import { useBlockedUsers } from "../../../context/BLockedUserContext";
import { useState } from "react";
import CommentActions from "./CommentActions";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface CommentCardProps {
  comment: CommentType;
  withAuth: (action: () => void) => () => void;
  userVote: number | null;
  commentUpvotes: number;
  commentDownvotes: number;
  upvote: () => void;
  downvote: () => void;
  upvotePending: boolean;
  downvotePending: boolean;
  onShowReplyPopup: () => void;
  onShowReportPopup: () => void;
  handleQuoteClick: () => void;
  showFullQuote: boolean;
  setShowFullQuote: SetState<boolean>;
}

const CommentCard = ({
  comment,
  withAuth,
  userVote,
  commentUpvotes,
  commentDownvotes,
  upvote,
  downvote,
  upvotePending,
  downvotePending,
  onShowReplyPopup,
  onShowReportPopup,
  handleQuoteClick,
  showFullQuote,
  setShowFullQuote,
}: CommentCardProps) => {
  const { isBlocked } = useBlockedUsers();
  const [showBlockedContent, setShowBlockedContent] = useState(false);

  const blocked = isBlocked(comment.commenter_id);

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
                  author_is_admin: comment.commenter_is_admin,
                  author_gender: comment.commenter_gender,
                })}`}
              >
                {comment.commenter_username}
                {comment.commenter_is_admin && (
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
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          #{comment.floor_number} {formatDate(comment.created_at)} (
          {formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
          })}
          )
        </p>

        <CommentActions
          withAuth={withAuth}
          onShowReplyPopup={onShowReplyPopup}
          onShowReportPopup={onShowReportPopup}
        />
      </div>

      <div
        className={blocked && !showBlockedContent ? "blur-md opacity-60" : ""}
      >
        {comment.parent_comment_id && comment.parent_comment_content && (
          <div className="mb-5">
            <div className="bg-[#2d2d2d] border-l-4 border-gray-500 rounded-r-lg p-4 text-sm">
              <div
                className="flex items-center gap-2 text-gray-300 font-medium mb-1 hover:underline cursor-pointer"
                onClick={handleQuoteClick}
              >
                <Reply size={18} className="rotate-180" />
                Replying to #{comment.parent_floor_number}{" "}
                <span
                  className={getUsernameColor({
                    is_admin: comment.parent_commenter_is_admin || false,
                    gender: comment.parent_commenter_gender,
                  })}
                >
                  {comment.parent_commenter_username}
                </span>
                {comment.parent_commenter_is_admin && (
                  <span className="text-xs bg-yellow-600 px-2 py-0.5 rounded font-medium">
                    Admin
                  </span>
                )}
                created at{" "}
                <span className="">
                  {formatDate(comment.parent_comment_created_at)}
                </span>
              </div>
              <div className="pl-6 ml-2">
                <SafeHTML
                  html={
                    showFullQuote ||
                    comment.parent_comment_content.length <= 120
                      ? comment.parent_comment_content
                      : comment.parent_comment_content.substring(0, 120) + "..."
                  }
                  className="text-gray-400 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                />

                {comment.parent_comment_content.length > 120 && (
                  <button
                    onClick={() => setShowFullQuote((prev) => !prev)}
                    className="text-cyan-400 text-xs mt-2 hover:text-cyan-300 transition font-medium cursor-pointer"
                  >
                    {showFullQuote ? "Show less" : "View full quote"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={`whitespace-pre-wrap break-all text-white text-base leading-relaxed mb-6 ${blocked && !showBlockedContent ? "hidden" : ""}`}
        >
          <SafeHTML
            html={comment.content}
            className="text-white text-base leading-relaxed mb-4"
          />

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

      {/* Vote Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <button
          onClick={withAuth(() => upvote())}
          disabled={upvotePending || downvotePending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
            userVote === 1
              ? "bg-green-900/80 text-green-400 ring-2 ring-green-500 shadow-lg shadow-green-500/20"
              : "text-green-400 hover:bg-green-900/40"
          }`}
        >
          <ThumbsUp
            size={18}
            className={userVote === 1 ? "fill-green-400" : ""}
          />
          <span className="tabular-nums">{commentUpvotes}</span>
        </button>

        <button
          onClick={withAuth(() => downvote())}
          disabled={upvotePending || downvotePending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium ${
            userVote === -1
              ? "bg-red-900/80 text-red-400 ring-2 ring-red-500 shadow-lg shadow-red-500/20"
              : "text-red-400 hover:bg-red-900/40"
          }`}
        >
          <ThumbsDown
            size={18}
            className={userVote === -1 ? "fill-red-400" : ""}
          />
          <span className="tabular-nums">{commentDownvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
