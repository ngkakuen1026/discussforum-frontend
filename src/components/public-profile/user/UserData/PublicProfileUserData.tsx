import type { UserType } from "../../../../types/userTypes";
import ActionCard from "./ActionCard";
import FollowerCard from "./FollowerCard";
import { useAuth } from "../../../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../../services/authAxios";
import { userFollowingAPI } from "../../../../services/http-api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useFollowingUsers } from "../../../../context/FollowingUserContext";
import { useAuthAction } from "../../../../utils/authUtils";
import { useBlockedUsers } from "../../../../context/BlockedUserContext";
import SettingRedirectCard from "./SettingRedirectCard";
import UserInfoCard from "./UserInfoCard";
import UserActivityCard from "./UserActivityCard";
import type { PostType } from "../../../../types/postTypes";
import AboutUserCard from "./AboutUserCard";

interface PublicProfileUserDataProps {
  publicUser: UserType;
  publicUserPosts: PostType[];
  publicUserCommentCount: string;
}

const PublicProfileUserData = ({
  publicUser,
  publicUserPosts,
  publicUserCommentCount,
}: PublicProfileUserDataProps) => {
  const { user } = useAuth();
  const { isFollowed } = useFollowingUsers();
  const {
    isBlocked,
    toggleBlockedUsers,
    isPending: isBlockPending,
  } = useBlockedUsers();
  const { withAuth } = useAuthAction();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${userFollowingAPI.url}/follow`, {
        followedId: Number(publicUser.id),
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
        data: { followedId: Number(publicUser.id) },
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
    if (isFollowed(publicUser.id)) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const isOwnProfile = user?.id === publicUser.id;

  return (
    <div>
      {!isOwnProfile ? (
        <ActionCard
          withAuth={withAuth}
          isFollowed={isFollowed(publicUser.id)}
          onToggleFollow={toggleFollow}
          isBlocked={isBlocked(publicUser.id)}
          onToggleBlock={() => toggleBlockedUsers(publicUser.id)}
          isBlockPending={isBlockPending}
        />
      ) : (
        <SettingRedirectCard />
      )}
      <FollowerCard publicUser={publicUser} />
      <AboutUserCard publicUser={publicUser} />
      <UserActivityCard
        publicUser={publicUser}
        publicUserPosts={publicUserPosts}
        publicUserCommentCount={publicUserCommentCount}
      />
      <UserInfoCard publicUser={publicUser} />
    </div>
  );
};

export default PublicProfileUserData;
