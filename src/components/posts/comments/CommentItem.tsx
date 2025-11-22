// src/features/comments/CommentItem.tsx
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

interface CommentItemProps {
  comment: CommentWithRepliesType;
  depth: number;
  floorNumber: number;
}

const CommentItem = ({ comment, depth, floorNumber }: CommentItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  return (
    <div
      className={`mt-8 ${depth > 0 ? "ml-12 border-l-4 border-gray-700 pl-8" : ""}`}
    >
      <div className="flex gap-10">
        {/* Left Sidebar - Avatar + User Info */}
        <div className="w-3/12">
          <div className="flex flex-col items-center py-6">
            <img
              src={getUserAvatar(comment)}
              alt={comment.commenter_username}
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            <div className="mt-6 text-left w-full pl-8">
              <p
                className={`font-bold text-xl ${getUsernameColor(comment)} flex items-center gap-2`}
                title="View User Profile"
              >
                <span
                  onClick={() =>
                    navigate({
                      to: "/public-profile/user/$userId",
                      params: { userId: comment.commenter_id.toString() },
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  {comment.commenter_username}
                </span>
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

        {/* Right Side - Content + Actions */}
        <div className="flex-1 flex flex-col justify-between min-h-64">
          {/* Content */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                #{floorNumber} {formatDate(comment.created_at)} (
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
                )
              </p>
            </div>

            <div className="ml-auto flex gap-2 items-start text-gray-400">
              <button title="Quote and Reply">
                <Reply
                  size={18}
                  className="hover:text-gray-500 transition cursor-pointer"
                />
              </button>
              <button title="Share Comment">
                <Share2
                  size={18}
                  className="hover:text-white transition cursor-pointer"
                />
              </button>
              <button title="Report Content">
                <Flag
                  size={18}
                  className="hover:text-red-500 transition cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div className="mt-4 min-h-64">
            <p className="whitespace-pre-wrap text-white">{comment.content}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => upvote.mutate()}
                disabled={upvote.isPending || downvote.isPending}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all font-medium min-w-20 justify-center ${
                  userVote === 1
                    ? "bg-green-900/80 text-green-400 ring-2 ring-green-500 shadow-lg shadow-green-500/20 cursor-not-allowed"
                    : "text-green-400 hover:bg-green-900/40"
                } ${userVote === -1 ? "cursor-not-allowed" : ""}`}
              >
                <ThumbsUp
                  size={18}
                  className={`transition-all ${userVote === 1 ? "fill-green-400" : "fill-none"}`}
                />
                <span className="tabular-nums">{commentUpvotes}</span>
              </button>

              <button
                onClick={() => downvote.mutate()}
                disabled={upvote.isPending || downvote.isPending}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all font-medium min-w-20 justify-center ${
                  userVote === -1
                    ? "bg-red-900/80 text-red-400 ring-2 ring-red-500 shadow-lg shadow-red-500/20 cursor-not-allowed"
                    : "text-red-400 hover:bg-red-900/40"
                } ${userVote === 1 ? "cursor-not-allowed" : ""}`}
              >
                <ThumbsDown
                  size={18}
                  className={`transition-all ${userVote === -1 ? "fill-red-400" : "fill-none"}`}
                />
                <span className="tabular-nums">{commentDownvotes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recursive Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-8">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              floorNumber={floorNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
