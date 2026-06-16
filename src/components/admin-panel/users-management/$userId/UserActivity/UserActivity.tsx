import { Link, useParams } from "@tanstack/react-router";
import authAxios from "../../../../../services/authAxios";
import {
  adminAPI,
  commentsAPI,
  postsAPI,
  userFollowingAPI,
} from "../../../../../services/http-api";
import { useQuery } from "@tanstack/react-query";
import type { PostType } from "../../../../../types/postTypes";
import type { UserFollowType } from "../../../../../types/userFollowTypes";
import {
  CircleOff,
  MessageCircle,
  Newspaper,
  UserPlus,
  UsersRound,
  Vote,
} from "lucide-react";

const UserActivity = () => {
  const { userId } = useParams({
    from: "/admin-panel/users-management/$userId",
  });

  const { data: user } = useQuery({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/profile/${userId}`,
      );
      return res.data.user;
    },
    refetchOnWindowFocus: false,
  });

  const { data: publicUserPosts = [] } = useQuery<PostType[]>({
    queryKey: ["admin-user-posts", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${postsAPI.url}/all-posts/user/${userId}`,
      );
      return res.data.publicUserPosts;
    },
    enabled: !!user,
  });

  const { data: publicUserCommentCountData = [] } = useQuery<
    { comment_count: string }[]
  >({
    queryKey: ["admin-user-comments", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${commentsAPI.url}/all-comments/user/${userId}`,
      );
      return res.data.publicUserCommentCount;
    },
    enabled: !!user,
  });

  const publicUserCommentCount =
    publicUserCommentCountData[0]?.comment_count ?? "0";

  const { data: voteStats } = useQuery({
    queryKey: ["public-user-votes", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/users/user/votes/${userId}`,
      );
      return res.data.stats;
    },
    enabled: !!user?.id,
  });

  const totalVotes = voteStats?.grandTotal ?? 0;

  const { data: PublicUserFollowers = [] } = useQuery<UserFollowType[]>({
    queryKey: ["admin-user-followers", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${userFollowingAPI.url}/followers/${user?.id}`,
      );
      return res.data.followers;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: PublicUserFollowingUsers = [] } = useQuery<UserFollowType[]>({
    queryKey: ["admin-user-followings", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${userFollowingAPI.url}/following/${user?.id}`,
      );
      return res.data.following;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: blockerUserData } = useQuery({
    queryKey: ["admin-user-blockers", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/user-blocked/user-blocker-list/${user?.id}/search`,
      );
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: blockedUserData } = useQuery({
    queryKey: ["admin-user-blockeds", user?.id],
    queryFn: async () => {
      const res = await authAxios.get(
        `${adminAPI.url}/user-blocked/user-blocked-list/${user?.id}/search`,
      );
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const userBlockerCount = blockerUserData?.userBlockerCount || 0;
  const userBlockedCount = blockedUserData?.userBlockedCount || 0;

  return (
    <div>
      <h2 className="text-4xl font-black adminHeading">User Activity</h2>

      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Posts */}
        <Link
          className="bg-linear-to-br from-orange-900/30 to-gray-900 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/50 transition-all group"
          to="/admin-panel/users-management/$userId/posts"
          params={{ userId: user?.id.toString() }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Posts Created
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {publicUserPosts.length}
              </p>
            </div>
            <Newspaper
              size={36}
              className="text-orange-400/80 group-hover:text-orange-400 transition"
            />
          </div>
        </Link>

        {/* Comments */}
        <div className="bg-linear-to-br from-cyan-900/30 to-gray-900 border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/50 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Comments Written
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {publicUserCommentCount}
              </p>
            </div>
            <MessageCircle
              size={36}
              className="text-cyan-400/80 group-hover:text-cyan-400 transition"
            />
          </div>
        </div>

        {/* Votes */}
        <div className="bg-linear-to-br from-purple-900/30 to-gray-900 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Total Votes
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {totalVotes}
              </p>
            </div>
            <Vote
              size={36}
              className="text-purple-400/80 group-hover:text-purple-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        {/* Followers */}
        <Link
          className="bg-linear-to-br from-emerald-900/30 to-gray-900 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group"
          to="/admin-panel/users-management/$userId/followers"
          params={{ userId: user?.id.toString() }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Followers
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {PublicUserFollowers.length}
              </p>
            </div>
            <UsersRound
              size={36}
              className="text-emerald-400/80 group-hover:text-emerald-400 transition"
            />
          </div>
        </Link>

        {/* Following */}
        <Link
          className="bg-linear-to-br from-sky-900/30 to-gray-900 border border-sky-500/30 rounded-2xl p-6 hover:border-sky-500/50 transition-all group"
          to="/admin-panel/users-management/$userId/following"
          params={{ userId: user?.id.toString() }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Following
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {PublicUserFollowingUsers.length}
              </p>
            </div>
            <UserPlus
              size={36}
              className="text-sky-400/80 group-hover:text-sky-400 transition"
            />
          </div>
        </Link>

        {/* Blocker (This user is blocked by others) */}
        <Link
          className="bg-linear-to-br from-rose-950/40 to-gray-900 border border-rose-500/30 rounded-2xl p-6 hover:border-rose-500/50 transition-all group"
          to="/admin-panel/users-management/$userId/blocker"
          params={{ userId: user?.id.toString() }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Blocker
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {userBlockerCount}
              </p>
            </div>
            <CircleOff
              size={36}
              className="text-rose-400/80 group-hover:text-rose-400 transition"
            />
          </div>
        </Link>

        {/* Blocked User (This user blocked others) */}
        <Link
          className="bg-linear-to-br from-red-950/40 to-gray-900 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all group"
          to="/admin-panel/users-management/$userId/blocked"
          params={{ userId: user?.id.toString() }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
                Blocked
              </p>
              <p className="font-bold text-white mt-2 text-3xl group-hover:text-5xl transition-all duration-150">
                {userBlockedCount}
              </p>
            </div>
            <UserPlus
              size={36}
              className="text-red-400/80 group-hover:text-red-400 transition"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserActivity;
