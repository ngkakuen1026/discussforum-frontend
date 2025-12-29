import { useQueries, useQuery } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { commentsAPI, postsAPI, usersAPI } from "../../../services/http-api";
import { useNavigate, useParams } from "@tanstack/react-router";
import PublicProfileHeader from "./PublicProfileHeader/PublicProfileHeader";
import { useState } from "react";
import AvatarPopup from "./PublicProfileHeader/AvatarPopup";
import BannerPopup from "./PublicProfileHeader/BannerPopup";
import PublicProfileUserData from "./UserData/PublicProfileUserData";
import type { PostType } from "../../../types/postTypes";
import PublicProfileUserPostData from "./PostData/PublicProfileUserPostData";
import type { VoteType } from "../../../types/voteType";

const PublicProfile = () => {
  const { userId } = useParams({ from: "/public-profile/user/$userId" });
  const navigate = useNavigate();
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [showBannerPopup, setShowBannerPopup] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await authAxios.get(`${usersAPI.url}/user-profile/${userId}`);
      return res.data.user;
    },
    refetchOnWindowFocus: false,
  });

  const { data: publicUserPosts = [] } = useQuery<PostType[]>({
    queryKey: ["public-user-posts", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${postsAPI.url}/all-posts/user/${user!.id}`
      );
      return res.data.publicUserPosts;
    },
    enabled: !!user,
  });

  const { data: publicUserCommentCountData = [] } = useQuery<
    { comment_count: string }[]
  >({
    queryKey: ["public-user-comments", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${commentsAPI.url}/all-comments/user/${user!.id}`
      );
      return res.data.publicUserCommentCount;
    },
    enabled: !!user,
  });

  const publicUserCommentCount =
    publicUserCommentCountData[0]?.comment_count ?? "0";

  const voteQueries =
    publicUserPosts?.map((publicUserPost) => ({
      queryKey: ["post-votes", publicUserPost.id],
      queryFn: async (): Promise<VoteType[]> => {
        const res = await authAxios.get(
          `${postsAPI.url}/votes/${publicUserPost.id}`
        );
        return res.data.votes;
      },
      enabled: !!publicUserPosts,
      staleTime: 1 * 60 * 1000,
    })) || [];

  const voteResults = useQueries({ queries: voteQueries });

  const commentQueries =
    publicUserPosts?.map((publicUserPost) => ({
      queryKey: ["comment-length", publicUserPost.id],
      queryFn: async () => {
        const res = await authAxios.get(
          `${commentsAPI.url}/${publicUserPost.id}/all-comments`
        );
        return res.data.comments;
      },
      enabled: !!publicUserPosts,
      staleTime: 1 * 60 * 1000,
    })) || [];

  const commentResults = useQueries({ queries: commentQueries });

  const handleCategoryClick = (categoryId: number) => {
    navigate({
      to: "/",
      search: { categoryId },
      replace: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">
          User not found or failed to load
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
      <PublicProfileHeader
        publicUser={user}
        onShowAvatarPopup={() => setShowAvatarPopup(true)}
        onShowBannerPopup={() => setShowBannerPopup(true)}
      />

      <div className="flex gap-10">
        <div className="flex-3">
          <PublicProfileUserData
            publicUser={user}
            publicUserPosts={publicUserPosts}
            publicUserCommentCount={publicUserCommentCount}
          />
        </div>

        <div className="flex-7">
          <PublicProfileUserPostData
            publicUser={user}
            publicUserPosts={publicUserPosts}
            voteResults={voteResults}
            commentResults={commentResults}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      {showAvatarPopup && (
        <AvatarPopup
          publicUser={user}
          onClose={() => setShowAvatarPopup(false)}
        />
      )}

      {showBannerPopup && (
        <BannerPopup
          publicUser={user}
          onClose={() => setShowBannerPopup(false)}
        />
      )}
    </div>
  );
};

export default PublicProfile;
