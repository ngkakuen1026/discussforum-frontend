import { useNavigate } from "@tanstack/react-router";
import type { UserFollowType } from "../../types/userFollowTypes";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { UserRoleTag } from "../UserRoleTag";
import { formatUserRegistrationDate } from "../../utils/dateUtils";
import { X } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";

interface UserFollowingPostCardProps {
  followingUser: UserFollowType;
  unfollowMutation: UseMutationResult<unknown, Error, number>;
}

const UserFollowingPostCard = ({
  followingUser,
  unfollowMutation,
}: UserFollowingPostCardProps) => {
  const navigate = useNavigate();

  const handleUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    unfollowMutation.mutate(followingUser.following_user_id);
  };

  return (
    <div
      onClick={() =>
        navigate({
          to: "/public-profile/user/$userId",
          params: { userId: followingUser.following_user_id.toString() },
          replace: true,
        })
      }
      className={`bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800/70 hover:border-cyan-500/40 transition-all duration-400 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer relative group overflow-hidden`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Fixed-size avatar */}
        <div className="shrink-0 flex flex-col items-center justify-between">
          <img
            src={getUserAvatar({
              author_profile_image: followingUser.following_user_profile_image,
              author_gender: followingUser.following_user_gender,
            })}
            alt={followingUser.following_user_username}
            className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-800 group-hover:ring-cyan-500/50 transition-all duration-300 mb-2"
          />
          <UserRoleTag
            user={{
              is_admin: followingUser.following_user_is_admin,
              gender: followingUser.following_user_gender,
            }}
          />
        </div>

        {/* Text content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <p
                className={`text-xl font-bold ${getUsernameColor({
                  author_gender: followingUser.following_user_gender,
                  author_is_admin: followingUser.following_user_is_admin,
                })}`}
              >
                {followingUser.following_user_username}
              </p>
            </div>

            <button
              onClick={handleUnfollow}
              disabled={unfollowMutation.isPending}
              className="text-gray-400 hover:text-gray-600 transition cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Unfollow user"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-300 text-sm mt-2">
            Member Since{" "}
            {formatUserRegistrationDate(
              followingUser.following_user_registration_date
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserFollowingPostCard;
