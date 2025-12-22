import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import {
  commentsAPI,
  postsAPI,
  userBlockedAPI,
  userFollowingAPI,
} from "../../../services/http-api";
import CommentsSection from "../comments/CommentSection";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Activity, useEffect, useState } from "react";
import CommentPopup from "./CommentPopup";
import { useAuthAction } from "../../../utils/authUtils";
import ReportPopup from "./ReportPopup";
import PostTags from "./PostTags";
import type { VoteType } from "../../../types/voteType";
import type { CommentWithRepliesType } from "../../../types/commentTypes";
import type { PostRouteSearch } from "../../../types/routeTypes";
import { useAuth } from "../../../context/AuthContext";
import { useBlockedUsers } from "../../../context/BLockedUserContext";
import { useFollowingUsers } from "../../../context/FollowingUserContext";
import PostCard from "./PostCard";
import PostActions from "./PostActions";
import PostBreadCrumb from "./PostBreadCrumb";
import PostPagination from "./PostPagination";
import BlockPopup from "./BlockPopup";
import UserCard from "../UserCard";
import { useFocusUser } from "../../../context/FocusUserContext";

const PostDetail = () => {
  const { withAuth } = useAuthAction();
  const { user } = useAuth();
  const { isBlocked } = useBlockedUsers();
  const { isFollowed } = useFollowingUsers();
  const { postId } = useParams({ from: "/posts/$postId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { focusUserId } = useFocusUser();

  const search = useSearch({ from: "/posts/$postId" }) as PostRouteSearch;
  const currentPage = Number(search.page) || 1;
  const COMMENTS_PER_PAGE = 15;

  const {
    data: post,
    isLoading: postLoading,
    isError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await authAxios.get(`${postsAPI.url}/post/${postId}`);
      return res.data.post;
    },
  });

  const { data: allComments = [], isLoading: commentsLoading } = useQuery<
    CommentWithRepliesType[]
  >({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${commentsAPI.url}/${postId}/all-comments`
      );
      return res.data.comments;
    },
  });

  const totalComments = allComments.length;
  const totalPages = Math.ceil((totalComments + 1) / COMMENTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    navigate({
      to: "/posts/$postId",
      params: { postId },
      search: {
        page: page === 1 ? undefined : page,
      },
      replace: true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allCommentsLength = (allComments || []).length;

  useEffect(() => {
    const scrollData = sessionStorage.getItem("scrollToComment");
    if (!scrollData) return;

    const { commentId } = JSON.parse(scrollData);

    const cleanup = () => {
      sessionStorage.removeItem("scrollToComment");
    };

    const attemptScroll = () => {
      const target = document.getElementById(`comment-${commentId}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });

        target.style.transition = "background-color 0.6s ease";
        target.style.backgroundColor = "rgba(34, 211, 238, 0.18)";

        setTimeout(() => {
          target.style.backgroundColor = "";
          cleanup();
        }, 5000);
      } else {
        if (attemptScroll.attempts < 60) {
          attemptScroll.attempts++;
          setTimeout(attemptScroll, 200);
        } else {
          cleanup();
        }
      }
    };

    attemptScroll.attempts = 0;

    requestAnimationFrame(() => {
      setTimeout(attemptScroll, 150);
    });

    return cleanup;
  }, [currentPage, allCommentsLength]);

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

  const followMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${userFollowingAPI.url}/follow`, {
        followedId: Number(post.user_id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-followings"] });
      toast.success("User followed!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        console.error(`User follow error: ${error}`);
        switch (status) {
          case 409:
            toast.info("Already Followed.");
        }
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () =>
      authAxios.delete(`${userFollowingAPI.url}/unfollow`, {
        data: { followedId: Number(post.user_id) },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-followings"] });
      toast.success("User unfollowed!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 409:
            toast.info("Fail to unfollow user.");
        }
      }
    },
  });

  const toggleFollow = () => {
    if (isFollowed(post.author_id)) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const unBlockMutation = useMutation({
    mutationFn: () =>
      authAxios.delete(`${userBlockedAPI.url}/unblock/${post.author_id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blockeds"] });
      toast.success("User unblocked!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        console.error(`User follow error: ${error}`);
      }
    },
  });

  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showBlockPopup, setShowBlockPopup] = useState(false);

  const filteredComment = focusUserId
    ? allComments.filter((c) => c.commenter_id === focusUserId)
    : allComments;

  if (postLoading || commentsLoading) {
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
    <div className="container mx-auto px-1 pb-8">
      <div className="py-6 border-b border-gray-800 ">
        <PostPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalComments={totalComments}
          onPageChange={handlePageChange}
        />
      </div>

      <div
        className={`flex items-center justify-between ${currentPage > 1 ? "pt-8" : "py-4"}`}
      >
        <PostBreadCrumb post={post} allCommentsLength={allCommentsLength} />

        <Activity mode={currentPage > 1 ? "hidden" : "visible"}>
          <div className={`text-white ${currentPage > 1 ? "pt-2" : "py-2"}`}>
            <PostTags postId={post.id} pendingTagName={post.pending_tag_name} />
          </div>
        </Activity>

        {currentPage > 1 && (
          <PostActions
            withAuth={withAuth}
            postId={Number(postId)}
            onShowCommentPopup={() => setShowCommentPopup(true)}
            onShowReportPopup={() => setShowReportPopup(true)}
          />
        )}
      </div>

      <Activity mode={currentPage > 1 ? "visible" : "hidden"}>
        <div className={`text-white ${currentPage > 1 ? "pt-2" : "py-2"}`}>
          <PostTags postId={post.id} pendingTagName={post.pending_tag_name} />
        </div>
      </Activity>

      {currentPage === 1 &&
        (!focusUserId || focusUserId === post.author_id) && (
          <div className={`grid grid-cols-12 gap-8`}>
            <>
              <UserCard
                user={user}
                withAuth={withAuth}
                userData={post}
                isFollowed={isFollowed(post.author_id)}
                onToggleFollow={toggleFollow}
                isBlocked={isBlocked(post.author_id)}
                onShowBlockPopup={() => setShowBlockPopup(true)}
                unBlockMutation={unBlockMutation}
              />

              <PostCard
                post={post}
                withAuth={withAuth}
                userVote={userVote}
                postUpvotes={postUpvotes}
                postDownvotes={postDownvotes}
                upvote={upvote.mutate}
                downvote={downvote.mutate}
                upvotePending={upvote.isPending}
                downvotePending={downvote.isPending}
                onShowCommentPopup={() => setShowCommentPopup(true)}
                onShowReportPopup={() => setShowReportPopup(true)}
              />
            </>
          </div>
        )}

      <CommentsSection
        comments={filteredComment}
        currentPage={currentPage}
        COMMENTS_PER_PAGE={COMMENTS_PER_PAGE}
        postId={postId}
        focusUserId={focusUserId} 
      />

      {/* Comment Popup */}
      {showCommentPopup && (
        <CommentPopup
          postId={postId}
          onClose={() => setShowCommentPopup(false)}
        />
      )}

      {/* Report Popup */}
      {showReportPopup && (
        <ReportPopup
          contentId={post.id}
          contentType={"post"}
          onClose={() => setShowReportPopup(false)}
          onSuccess={() => {
            toast.info("Thank you. Our team will review this report.");
          }}
        />
      )}

      {/* Block Popup */}
      {showBlockPopup && (
        <BlockPopup
          userId={post.author_id}
          userName={post.author_username}
          userProfileImage={post.author_profile_image}
          userGender={post.author_gender}
          userIsAdmin={post.author_is_admin}
          onClose={() => setShowBlockPopup(false)}
          onSuccess={() => {
            toast.info("You can view blocked users in top right user menu.");
          }}
        />
      )}
    </div>
  );
};

export default PostDetail;
