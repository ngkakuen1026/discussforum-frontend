import { useNavigate } from "@tanstack/react-router";
import authAxios from "../../../../services/authAxios";
import { userFollowingAPI } from "../../../../services/http-api";
import type { UserType } from "../../../../types/userTypes";
import type { UserFollowType } from "../../../../types/userFollowTypes";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthContext";

interface FollowerCardProps {
  publicUser: UserType;
}

const FollowerCard = ({ publicUser }: FollowerCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: PublicUserFollowers = [] } = useQuery<UserFollowType[]>({
    queryKey: ["public-user-followers", publicUser.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${userFollowingAPI.url}/followers/${publicUser.id}`
      );
      return res.data.followers;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: PublicUserFollowingUsers = [] } = useQuery<UserFollowType[]>({
    queryKey: ["public-user-followings", publicUser.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${userFollowingAPI.url}/following/${publicUser.id}`
      );
      return res.data.following;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isOwnProfile = user?.id === publicUser.id;

  return (
    <div className="mt-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="px-8 py-4 border-b border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200">Followers</h3>
      </div>

      <div className="p-4">
        <div className="flex justify-center space-x-2 ">
          <div className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300">
            <span className="text-3xl text-gray-300 group-hover:text-gray-100 font-medium transition ">
              {PublicUserFollowers.length}
            </span>
            <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
              Followers
            </span>
          </div>
          {isOwnProfile ? (
            <div
              onClick={() => navigate({ to: "/user-following" })}
              className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <span className="text-3xl text-gray-300 group-hover:text-gray-100 font-medium transition">
                {PublicUserFollowingUsers.length}
              </span>
              <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
                Followings
              </span>
            </div>
          ) : (
            <div className="group flex flex-col items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300">
              <span className="text-3xl text-gray-300 group-hover:text-gray-100 font-medium transition">
                {PublicUserFollowingUsers.length}
              </span>
              <span className="text-gray-300 group-hover:text-gray-100 font-medium transition">
                Followings
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowerCard;
