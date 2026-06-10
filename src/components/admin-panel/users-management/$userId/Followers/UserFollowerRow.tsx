import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import type { UserFollowerType } from "../../../../../types/userFollowTypes";
import { getUserAvatar } from "../../../../../utils/userUtils";
import { UserRoleTag } from "../../../../UserRoleTag";
import { formatDate, formatUserRegistrationDate } from "../../../../../utils/dateUtils";
import UserFollowerListActionDropdown from "./UserFollowerListActionDropdown";

interface UserFollowerListProps {
  follower: UserFollowerType;
  userId: string;
  username: string;
}

const UserFollowerRow = ({
  follower,
  userId,
  username,
}: UserFollowerListProps) => {
  const { data: banInfo, isLoading } = useUserBanStatus(
    follower.follower_user_id,
  );

  return (
    <tr
      key={follower.follower_user_id}
      className="hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-6 py-4">
        <img
          src={getUserAvatar({
            author_profile_image: follower.follower_user_profile_image,
          })}
          alt={follower.follower_user_username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium">{follower.follower_user_id}</td>
      <td className="px-6 py-4 font-mono">{follower.follower_user_username}</td>
      <td className="px-6 py-4 text-gray-300">
        {follower.follower_user_first_name &&
        follower.follower_user_last_name ? (
          <span>
            {follower.follower_user_first_name}{" "}
            {follower.follower_user_last_name}
          </span>
        ) : (
          <span className="font-extrabold">&lt;Blank&gt;</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {follower.follower_user_email}
      </td>
      <td className="px-6 py-4">
        <UserRoleTag
          user={{ author_is_admin: follower.follower_user_is_admin }}
        />
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(follower.follower_user_registration_date)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(follower.follower_user_last_login_at)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDate(follower.followed_at)}
      </td>

      <td className="px-6 py-4 text-sm">
        {isLoading ? (
          "Loading..."
        ) : banInfo?.isBanned ? (
          <span className="text-red-500 font-bold">Suspended</span>
        ) : (
          <span className="text-green-500">Normal</span>
        )}
      </td>
      <td className="px-6 py-4 text-center">
        <UserFollowerListActionDropdown
          follower={follower}
          userId={userId}
          username={username}
        />
      </td>
    </tr>
  );
};

export default UserFollowerRow;
