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

interface CommentItemProps {
  comment: CommentWithRepliesType;
  depth: number;
  floorNumber: number;
}

const CommentItem = ({ comment, depth, floorNumber }: CommentItemProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: votes = [] } = useQuery({
    queryKey: ["comment-votes", comment.id],
    queryFn: async () => {
      const res = await authAxios.get(`${commentsAPI.url}/votes/${comment.id}`);
      return res.data.votes;
    },
  });

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
        if (status === 403) {
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

  const upvotes = votes.find((v: VoteType) => v.vote_type === 1)?.count || 0;
  const downvotes = votes.find((v: VoteType) => v.vote_type === -1)?.count || 0;

  const getUsernameColor = () => {
    if (comment.commenter_is_admin) return "text-yellow-300";
    switch (comment.commenter_gender) {
      case "Male":
        return "text-blue-400";
      case "Female":
        return "text-pink-400";
      case "Prefer Not to Say":
      default:
        return "text-gray-300";
    }
  };

  return (
    <div
      className={`mt-8 ${depth > 0 ? "ml-12 border-l-4 border-gray-700 pl-8" : ""}`}
    >
      <div className="flex gap-10">
        {/* Left Sidebar - Avatar + User Info */}
        <div className="w-3/12">
          <div className="flex flex-col items-center py-6">
            <img
              src={
                comment.commenter_profile_image ||
                "../src/assets/Images/default_user_icon.png"
              }
              alt={comment.commenter_username}
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            <div className="mt-6 text-left w-full pl-8">
              <p
                className={`font-bold text-xl ${getUsernameColor()} flex items-center gap-2`}
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
                className="flex items-center gap-2 px-3 py-2 text-green-400 rounded-full hover:bg-green-900/50 transition font-medium"
              >
                <ThumbsUp size={18} /> {upvotes}
              </button>
              <button
                onClick={() => downvote.mutate()}
                className="flex items-center gap-2 px-3 py-2  text-red-400 rounded-full hover:bg-red-900/50 transition font-medium"
              >
                <ThumbsDown size={18} /> {downvotes}
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
