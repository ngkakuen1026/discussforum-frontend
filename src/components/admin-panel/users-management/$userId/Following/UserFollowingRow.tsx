import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import type { UserFollowType } from "../../../../../types/userFollowTypes";
import { getUserAvatar } from "../../../../../utils/userUtils";
import { UserRoleTag } from "../../../../UserRoleTag";
import {
  formatDate,
  formatUserRegistrationDate,
} from "../../../../../utils/dateUtils";
import UserFollowingListActionDropdown from "./UserFollowingListActionDropdown";

interface UserFollowingListProps {
  following: UserFollowType;
  userId: string;
  username: string;
}

const UserFollowingRow = ({
  following,
  userId,
  username,
}: UserFollowingListProps) => {
  const { data: banInfo, isLoading } = useUserBanStatus(
    following.following_user_id,
  );

  return (
    <tr
      key={following.following_user_id}
      className="hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-6 py-4">
        <img
          src={getUserAvatar({
            author_profile_image: following.following_user_profile_image,
          })}
          alt={following.following_user_username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium">{following.following_user_id}</td>
      <td className="px-6 py-4 font-mono">{following.following_user_username}</td>
      <td className="px-6 py-4 text-gray-300">
        {following.following_user_first_name &&
        following.following_user_last_name ? (
          <span>
            {following.following_user_first_name}{" "}
            {following.following_user_last_name}
          </span>
        ) : (
          <span className="font-extrabold">&lt;Blank&gt;</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {following.following_user_email}
      </td>
      <td className="px-6 py-4">
        <UserRoleTag
          user={{ author_is_admin: following.following_user_is_admin }}
        />
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(following.following_user_registration_date)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(following.following_user_last_login_at)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDate(following.followed_at)}
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
        <UserFollowingListActionDropdown
          following={following}
          userId={userId}
          username={username}
        />
      </td>
    </tr>
  );
};

export default UserFollowingRow;
