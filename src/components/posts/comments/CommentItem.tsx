import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown, Share2, Flag, Reply } from "lucide-react";
import authAxios from "../../../services/authAxios";
import { commentsAPI } from "../../../services/http-api";
import type { CommentWithRepliesType } from "../../../types/commentTypes";
import {
  formatDate,
  formatUserRegistrationDate,
} from "../../../utils/dateUtils";
import { formatDistanceToNow } from "date-fns";
import type { VoteType } from "../../../types/voteType";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";
import { useState } from "react";
import CommentPopup from "../CommentPopup";
import { useAuthAction } from "../../../utils/authUtils";
import ReportPopup from "../ReportPopup";

interface CommentItemProps {
  comment: CommentWithRepliesType;
  depth?: number;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { withAuth } = useAuthAction();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showFullQuote, setShowFullQuote] = useState(false);

  const { data: voteData } = useQuery({
    queryKey: ["comment-votes", comment.id],
    queryFn: async () => {
      const res = await authAxios.get(`${commentsAPI.url}/votes/${comment.id}`);
      return res.data;
    },
  });

  const votes = voteData?.votes || [];
  const userVote = voteData?.user_vote;

  const upvote = useMutation({
    mutationFn: () =>
      authAxios.post(`${commentsAPI.url}/votes/${comment.id}`, { voteType: 1 }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["comment-votes", comment.id],
      }),
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 403:
            toast.error("You have already voted on this comment.");
        }
      }
    },
  });

  const downvote = useMutation({
    mutationFn: () =>
      authAxios.post(`${commentsAPI.url}/votes/${comment.id}`, {
        voteType: -1,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["comment-votes", comment.id],
      }),
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 403) {
          toast.error("You have already voted on this comment.");
        }
      }
    },
  });

  const commentUpvotes =
    votes.find((v: VoteType) => v.vote_type === 1)?.count || 0;
  const commentDownvotes =
    votes.find((v: VoteType) => v.vote_type === -1)?.count || 0;

  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);

  return (
    <div className="mt-8 p-1">
      <div className="grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-3 flex flex-col items-center">
          <div className="py-6 w-full">
            <img
              src={getUserAvatar(comment)}
              alt={comment.commenter_username}
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-700 shadow-lg mx-auto"
            />
            <div className="mt-6 text-left pl-8">
              <p
                className={`font-bold text-xl ${getUsernameColor(comment)} flex items-center gap-2`}
              >
                <button
                  onClick={() =>
                    navigate({
                      to: "/public-profile/user/$userId",
                      params: { userId: comment.commenter_id!.toString() },
                    })
                  }
                  className="relative group cursor-pointer"
                >
                  <span className="hover:opacity-80 transition">
                    {comment.commenter_username}
                  </span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                    View {comment.commenter_username}'s profile
                  </span>
                </button>
                {comment.commenter_is_admin && (
                  <span className="text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                    Admin
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Registered:{" "}
                {formatUserRegistrationDate(
                  comment.commenter_registration_date
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-9 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">
              #{comment.floor_number} {formatDate(comment.created_at)} (
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
              )
            </p>

            <div className="flex gap-2 text-gray-400">
              <button
                onClick={withAuth(() => setShowReplyPopup(true))}
                className="relative group cursor-pointer"
              >
                <Reply
                  size={18}
                  className="hover:text-cyan-500 transition cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                  Reply to Comment
                </span>
              </button>
              <button className="relative group cursor-pointer">
                <Share2 size={18} className="hover:text-white transition" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                  Share Comment
                </span>
              </button>
              <button
                onClick={() => setShowReportPopup(true)}
                className="relative group transition-all"
              >
                <Flag
                  size={18}
                  className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Report Content
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1">
            {comment.parent_comment_id && comment.parent_comment_content && (
              <div className="mb-5">
                <div className="bg-[#2d2d2d] border-l-4 border-gray-500 rounded-r-lg p-4 text-sm">
                  <div
                    className="flex items-center gap-2 text-gray-300 font-medium mb-1 hover:underline"
                    onClick={() => {
                      const target = document.getElementById(
                        `comment-${comment.parent_comment_id}`
                      );
                      if (target) {
                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        target.style.transition = "background-color 0.6s";
                        target.style.backgroundColor =
                          "rgba(34, 211, 238, 0.15)";
                        setTimeout(() => {
                          target.style.backgroundColor = "";
                        }, 2000);
                      }
                    }}
                  >
                    <Reply
                      size={18}
                      className="rotate-180 cursor-pointer hover:opacity-75"
                    />
                    <button className="cursor-pointer transition">
                      Replying to #{comment.parent_floor_number ?? "?"}{" "}
                      <span
                        className={getUsernameColor({
                          is_admin: comment.parent_commenter_is_admin,
                          gender: comment.parent_commenter_gender,
                        })}
                      >
                        {comment.parent_commenter_username}{" "}
                      </span>
                    </button>
                    {comment.parent_commenter_is_admin && (
                      <span className="text-xs bg-yellow-600 text-yellow-400 px-3 py-1 rounded-lg font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-6   whitespace-pre-wrap break-all transition-all duration-300">
                    {showFullQuote
                      ? comment.parent_comment_content
                      : comment.parent_comment_content.length > 120
                        ? comment.parent_comment_content.substring(0, 120) +
                          "..."
                        : comment.parent_comment_content}
                  </p>
                  {comment.parent_comment_content.length > 120 && (
                    <button
                      onClick={() => setShowFullQuote(!showFullQuote)}
                      className="text-cyan-400 text-xs mt-3 pl-7 cursor-pointer hover:text-cyan-300 transition font-medium"
                    >
                      {showFullQuote
                        ? "Show less"
                        : "Click to view full comment"}
                    </button>
                  )}
                </div>
              </div>
            )}

            <p className="whitespace-pre-wrap break-all text-white text-base leading-relaxed mb-6">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <button
              onClick={() => upvote.mutate()}
              disabled={upvote.isPending || downvote.isPending}
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
              <span className="tabular-nums">{commentUpvotes}</span>
            </button>

            <button
              onClick={() => downvote.mutate()}
              disabled={upvote.isPending || downvote.isPending}
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
              <span className="tabular-nums">{commentDownvotes}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Popup (reply quoting) */}
      {showReplyPopup && (
        <CommentPopup
          postId={comment.post_id.toString()}
          parentComment={{
            id: comment.id,
            content: comment.content,
            commenter_username: comment.commenter_username,
          }}
          onClose={() => setShowReplyPopup(false)}
        />
      )}

      {/* Report Popup */}
      {showReportPopup && (
        <ReportPopup
          contentId={comment.id}
          contentType={"comment"}
          onClose={() => setShowReportPopup(false)}
          onSuccess={() => {
            toast.info("Thank you. Our team will review this report.");
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
