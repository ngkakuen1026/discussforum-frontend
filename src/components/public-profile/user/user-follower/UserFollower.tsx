import { useFollowingUsers } from "../../../../context/FollowingUserContext";
import { UserPlus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserFollowerToolbar from "./UserFollowerToolbar";
import UserFollowerPostCard from "./UserFollowerCard";
import authAxios from "../../../../services/authAxios";
import { userFollowingAPI } from "../../../../services/http-api";
import { isAxiosError } from "axios";

const UserFollower = () => {
  const queryClient = useQueryClient();
  const { myFollowers, myFollowersLoading } = useFollowingUsers();

  const refreshMyFollower = () => {
    queryClient.refetchQueries({ queryKey: ["my-followers"] });
    queryClient.refetchQueries({ queryKey: ["public-user-followers"] });
    toast.success(`My Follower Refreshed!`);
  };

  const removeMutation = useMutation({
    mutationFn: (followerId: number) =>
      authAxios.delete(`${userFollowingAPI.url}/remove-follower`, {
        data: { followerId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-followers"] });
      queryClient.refetchQueries({ queryKey: ["public-user-followers"] });
      toast.success("User removed!");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.info("Failed to remove user.");
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if (myFollowersLoading) {
    return <div className="text-center py-8">Loading followers...</div>;
  }

  return (
    <div className="container mx-auto pt-6">
      <UserFollowerToolbar
        followerUsers={myFollowers}
        refreshMyFollower={refreshMyFollower}
      />

      {myFollowers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          {myFollowers.map((followerUser) => (
            <UserFollowerPostCard
              key={followerUser.follower_user_id}
              followerUser={followerUser}
              removeMutation={removeMutation}
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

export default UserFollower;
