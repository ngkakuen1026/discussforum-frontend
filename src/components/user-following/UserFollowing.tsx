import UserFollowingToolbar from "./UserFollowingToolbar";
import { useFollowingUsers } from "../../context/FollowingUserContext";
import { UserPlus } from "lucide-react";
import UserFollowingPostCard from "./UserFollowingCard";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import authAxios from "../../services/authAxios";
import { userFollowingAPI } from "../../services/http-api";
import { isAxiosError } from "axios";

const UserFollowing = () => {
  const queryClient = useQueryClient();
  const { myFollowingUsers, myFollowingLoading } = useFollowingUsers();

  const refreshMyFollowing = () => {
    queryClient.refetchQueries({ queryKey: ["my-followings"] });
    toast.success(`My Following User Refreshed!`);
  };

  const unfollowMutation = useMutation({
    mutationFn: (followedId: number) =>
      authAxios.delete(`${userFollowingAPI.url}/unfollow`, {
        data: { followedId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-followings"] });
      toast.success("User unfollowed!");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.info("Failed to unfollow user.");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if (myFollowingLoading) {
    return <div className="text-center py-8">Loading following users...</div>;
  }

  return (
    <div className="container mx-auto pt-6">
      <UserFollowingToolbar
        followingUsers={myFollowingUsers}
        refreshMyFollowing={refreshMyFollowing}
      />

      {myFollowingUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {myFollowingUsers.map((followingUser) => (
            <UserFollowingPostCard
              key={followingUser.following_user_id}
              followingUser={followingUser}
              unfollowMutation={unfollowMutation}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl">No followed users yet.</p>
          <p className="text-gray-500 mt-4">
            Visit a post and click{" "}
            <Link
              to="/"
              search={{ categoryId: 0 }}
              className="text-gray-400 hover:text-gray-600"
              target="_blank"
            >
              "<UserPlus className="inline" size={20} />
              Follow User"
            </Link>{" "}
            to start following.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserFollowing;
