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
import { bookmarksAPI, postsAPI } from "../../services/http-api";
import { formatDate, formatUserRegistrationDate } from "../../utils/dateUtils";
import CommentsSection from "./comments/CommentSection";
import type { VoteType } from "../../types/voteType";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { BookmarkType } from "../../types/bookmarkTypes";
import { getUsernameColor } from "../../utils/userUtils";

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

  const { data: voteData } = useQuery({
    queryKey: ["post-votes", postId],
    queryFn: async () => {
      const res = await authAxios.get(`${postsAPI.url}/votes/${postId}`);
      return res.data;
    },
    enabled: !!post,
  });

  const votes = voteData?.votes || [];
  const userVote = voteData?.user_vote;

  const upvote = useMutation({
    mutationFn: () =>
      authAxios.post(`${postsAPI.url}/votes/${postId}`, { voteType: 1 }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["post-votes", postId] }),
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 403:
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
        switch (status) {
          case 403:
            toast.error("You have already voted on this post.");
        }
      }
    },
  });

  const postUpvotes =
    votes.find((v: VoteType) => v.vote_type === 1)?.count || 0;
  const postDownvotes =
    votes.find((v: VoteType) => v.vote_type === -1)?.count || 0;

  const { data: myBookmarks = [], isLoading: bookmarksLoading } = useQuery({
    queryKey: ["my-bookmarks"],
    queryFn: async () => {
      const res = await authAxios.get(`${bookmarksAPI.url}/bookmark/me`);
      return res.data.bookmarks;
    },
  });

  const isBookmarked = myBookmarks.some(
    (b: BookmarkType) => b.post_id === Number(postId)
  );

  const bookmarkMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${bookmarksAPI.url}/bookmark`, {
        postId: Number(postId),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success("Post Pinned!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 409:
            toast.info("Already Pinned");
        }
      }
    },
  });

  const unbookmarkMutation = useMutation({
    mutationFn: () =>
      authAxios.delete(`${bookmarksAPI.url}/bookmark/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      toast.success("Post unpinned");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        console.error(`unbookmarkMutation error: ${error}`);
      } else {
        toast.error("Failed to remove pin");
      }
    },
  });

  const toggleBookmark = () => {
    if (isBookmarked) {
      unbookmarkMutation.mutate();
    } else {
      bookmarkMutation.mutate();
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
                className={`font-bold text-xl ${getUsernameColor(post)} flex items-center gap-2`}
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
          <div className="flex">
            <div>
              <h1 className="text-2xl text-gray-200 font-bold">{post.title}</h1>
              <p className="text-sm text-gray-400">
                #1 Posted on: {formatDate(post.created_at)} (
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
                )
              </p>
            </div>

            <div className="ml-auto flex gap-2 items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark();
                }}
                disabled={
                  bookmarkMutation.isPending ||
                  unbookmarkMutation.isPending ||
                  bookmarksLoading
                }
                className="relative group transition-all"
              >
                {isBookmarked ? (
                  <Pin
                    size={18}
                    className="fill-yellow-500 text-yellow-500 drop-shadow-md transition-all cursor-pointer"
                  />
                ) : (
                  <Pin
                    size={18}
                    className="text-gray-400 hover:text-yellow-500 hover:fill-yellow-500/30 transition-all cursor-pointer"
                  />
                )}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  {isBookmarked
                    ? "Bookmarked ✓ (click to remove)"
                    : "Click to bookmark"}
                </span>
              </button>
              <button className="relative group transition-all">
                <MessageCircle
                  size={18}
                  className="text-gray-400 hover:text-gray-500 transition cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Reply to Post
                </span>
              </button>
              <button className="relative group transition-all">
                <Share2
                  size={18}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  Share Post
                </span>
              </button>
              <button className="relative group transition-all">
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

          <div className="mt-4 min-h-64">
            <p className="whitespace-pre-wrap text-white">{post.content}</p>
          </div>

          <div className="">
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
                <span className="tabular-nums">{postUpvotes}</span>
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
                <span className="tabular-nums">{postDownvotes}</span>
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
