import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import {
  commentsAPI,
  userBlockedAPI,
  userFollowingAPI,
} from "../../../services/http-api";
import type { CommentWithRepliesType } from "../../../types/commentTypes";
import type { VoteType } from "../../../types/voteType";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import CommentPopup from "../PostDetail/CommentPopup";
import { useAuthAction } from "../../../utils/authUtils";
import ReportPopup from "../PostDetail/ReportPopup";
import { useAuth } from "../../../context/AuthContext";
import { useBlockedUsers } from "../../../context/BLockedUserContext";
import { useFollowingUsers } from "../../../context/FollowingUserContext";
import BlockPopup from "../PostDetail/BlockPopup";
import UserCard from "../UserCard";
import CommentCard from "./CommentCard";

interface CommentItemProps {
  comment: CommentWithRepliesType;
  commentsPerPage: number;
  focusUserId: number | null;
  onFocusUser: (id: number | null) => void;
}

const CommentItem = ({
  comment,
  commentsPerPage,
  focusUserId,
  onFocusUser,
}: CommentItemProps) => {
  const { withAuth } = useAuthAction();
  const { user } = useAuth();
  const { isBlocked } = useBlockedUsers();
  const { isFollowed } = useFollowingUsers();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ from: "/posts/$postId" }) as { page?: number };
  const currentPage = search.page || 1;

  const [showFullQuote, setShowFullQuote] = useState(false);
  const [showReplyPopup, setShowReplyPopup] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [showBlockPopup, setShowBlockPopup] = useState(false);

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
      if (isAxiosError(error) && error.response?.status === 403) {
        toast.error("You have already voted on this comment.");
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
      if (isAxiosError(error) && error.response?.status === 403) {
        toast.error("You have already voted on this comment.");
      }
    },
  });

  const commentUpvotes =
    votes.find((v: VoteType) => v.vote_type === 1)?.count || 0;
  const commentDownvotes =
    votes.find((v: VoteType) => v.vote_type === -1)?.count || 0;

  const followMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${userFollowingAPI.url}/follow`, {
        followedId: Number(comment.commenter_id),
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
        data: { followedId: Number(comment.commenter_id) },
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
    if (isFollowed(comment.commenter_id)) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const unBlockMutation = useMutation({
    mutationFn: () =>
      authAxios.delete(`${userBlockedAPI.url}/unblock/${comment.commenter_id}`),
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

  const handleQuoteClick = () => {
    const floor = Number(comment.parent_floor_number);
    if (!floor || floor <= 0) return;

    const N = commentsPerPage || 15;
    let targetPage = 1;
    if (floor <= N) {
      targetPage = 1;
    } else {
      targetPage = Math.ceil((floor - N) / N) + 1;
    }

    if (targetPage === currentPage) {
      const target = document.getElementById(
        `comment-${comment.parent_comment_id}`
      );
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.style.transition = "background-color 0.6s";
        target.style.backgroundColor = "rgba(34, 211, 238, 0.15)";
        setTimeout(() => {
          target.style.backgroundColor = "";
        }, 2500);
      }
    } else {
      navigate({
        to: "/posts/$postId",
        params: { postId: comment.post_id.toString() },
        search: { page: targetPage === 1 ? undefined : targetPage },
        replace: true,
      });

      sessionStorage.setItem(
        "scrollToComment",
        JSON.stringify({
          commentId: comment.parent_comment_id,
        })
      );
    }
  };

  return (
    <div id={`comment-${comment.id}`} className={`mt-8`}>
      <div className="grid grid-cols-12 gap-8">
        <UserCard
          user={user}
          withAuth={withAuth}
          userData={comment}
          isFollowed={isFollowed(comment.commenter_id)}
          onToggleFollow={toggleFollow}
          isBlocked={isBlocked(comment.commenter_id)}
          onShowBlockPopup={() => setShowBlockPopup(true)}
          unBlockMutation={unBlockMutation}
          focusUserId={focusUserId}
          onFocusUser={onFocusUser}
        />

        <CommentCard
          comment={comment}
          withAuth={withAuth}
          userVote={userVote}
          commentUpvotes={commentUpvotes}
          commentDownvotes={commentDownvotes}
          upvote={upvote.mutate}
          downvote={downvote.mutate}
          upvotePending={upvote.isPending}
          downvotePending={downvote.isPending}
          onShowReplyPopup={() => setShowReplyPopup(true)}
          onShowReportPopup={() => setShowReportPopup(true)}
          handleQuoteClick={handleQuoteClick}
          showFullQuote={showFullQuote}
          setShowFullQuote={setShowFullQuote}
        />
      </div>

      {/* Popups */}
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

      {showReportPopup && (
        <ReportPopup
          contentId={comment.id}
          contentType="comment"
          onClose={() => setShowReportPopup(false)}
          onSuccess={() =>
            toast.info("Thank you. Our team will review this report.")
          }
        />
      )}

      {showBlockPopup && (
        <BlockPopup
          userId={comment.commenter_id}
          userName={comment.commenter_username}
          userProfileImage={comment.commenter_profile_image}
          userGender={comment.commenter_gender}
          userIsAdmin={comment.commenter_is_admin}
          onClose={() => setShowBlockPopup(false)}
          onSuccess={() => {
            toast.info(
              "You can view blocked users list in top right user menu."
            );
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
