import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Pin,
  MessageCircle,
} from "lucide-react";
import authAxios from "../../services/authAxios";
import { postsAPI } from "../../services/http-api";
import { formatDate, formatUserRegistrationDate } from "../../utils/dateUtils";
import CommentsSection from "./comments/CommentSection";
import type { VoteType } from "../../types/voteType";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const PostDetail = () => {
  const { postId } = useParams({ from: "/posts/$postId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await authAxios.get(`${postsAPI.url}/post/${postId}`);
      return res.data.post;
    },
  });

  const { data: votes = [] } = useQuery({
    queryKey: ["post-votes", postId],
    queryFn: async () => {
      const res = await authAxios.get(`${postsAPI.url}/votes/${postId}`);
      return res.data.votes;
    },
    enabled: !!post,
  });

  const upvote = useMutation({
    mutationFn: () =>
      authAxios.post(`${postsAPI.url}/votes/${postId}`, { voteType: 1 }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post-votes", postId] }),
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 403) {
          toast.error("You have already voted on this post.");
        }
      }
    },
  });

  const downvote = useMutation({
    mutationFn: () =>
      authAxios.post(`${postsAPI.url}/votes/${postId}`, { voteType: -1 }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post-votes", postId] }),
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 403) {
          toast.error("You have already voted on this post.");
        }
      }
    },
  });

  const postUpvotes =
    votes.find((v: VoteType) => v.vote_type === 1)?.count || 0;
  const postDownvotes =
    votes.find((v: VoteType) => v.vote_type === -1)?.count || 0;

  const getUsernameColor = () => {
    if (post.author_is_admin) {
      return "text-yellow-300";
    }

    switch (post.author_gender) {
      case "Male":
        return "text-blue-400";
      case "Female":
        return "text-pink-400";
      case "Prefer Not to Say":
      default:
        return "text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">
          Post not found or failed to load
        </p>
        <button
          onClick={() =>
            navigate({ to: "/", search: { categoryId: 0 }, replace: true })
          }
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6">
      <div className="flex flex-row gap-12">
        <div className="w-3/12">
          <div className="flex flex-col items-center py-6">
            <img
              src={
                post.author_profile_image ||
                "../src/assets/Images/default_user_icon.png"
              }
              alt={post.author_username}
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
                      params: { userId: post.author_id.toString() },
                    })
                  }
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  {post.author_username}
                </span>
                {post.author_is_admin && (
                  <span className="text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                    Admin
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Registered:{" "}
                {formatUserRegistrationDate(post.author_registration_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="w-9/12 flex flex-col justify-between">
          {/* Post Title and Icon Button Group */}
          <div className="flex ">
            <div>
              <h1 className="text-2xl text-cyan-400 font-bold">{post.title}</h1>
              <p className="text-sm text-gray-400">
                #1 Posted on: {formatDate(post.created_at)} (
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
                )
              </p>
            </div>

            <div className="ml-auto flex gap-2 items-center">
              <button title="Pin it">
                <Pin
                  size={18}
                  className="text-gray-400 hover:text-yellow-600 transition cursor-pointer"
                />
              </button>
              <button title="Reply to Post">
                <MessageCircle
                  size={18}
                  className="text-gray-400 hover:text-gray-500 transition cursor-pointer"
                />
              </button>
              <button title="Share Post">
                <Share2
                  size={18}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                />
              </button>
              <button title="Report Content">
                <Flag
                  size={18}
                  className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                />
              </button>
            </div>
          </div>

          <div className="mt-4 min-h-64">
            <p className="whitespace-pre-wrap text-white">{post.content}</p>
          </div>

          <div className="">
            <div className="flex items-center gap-2">
              <button
                onClick={() => upvote.mutate()}
                disabled={upvote.isPending}
                className="flex items-center gap-2 px-3 py-2 text-green-400 rounded-full hover:bg-green-900/50 transition font-medium"
              >
                <ThumbsUp size={18} /> {postUpvotes}
              </button>
              <button
                onClick={() => downvote.mutate()}
                disabled={downvote.isPending}
                className="flex items-center gap-2 px-3 py-2  text-red-400 rounded-full hover:bg-red-900/50 transition font-medium"
              >
                <ThumbsDown size={18} /> {postDownvotes}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection postId={postId} />
    </div>
  );
};

export default PostDetail;
