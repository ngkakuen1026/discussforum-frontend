import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import { getUserAvatar } from "../../../../../utils/userUtils";
import { UserRoleTag } from "../../../../UserRoleTag";
import { formatDate, formatUserRegistrationDate } from "../../../../../utils/dateUtils";
import UserBlockedListActionDropdown from "./UserBlockedListActionDropdown";
import type { UserBlockedType } from "../../../../../types/userBlcokedTypes";

interface UserBlockedListProps {
  blocked: UserBlockedType;
  userId: string;
  username: string;
}

const UserBlockedRow = ({
  blocked,
  userId,
  username,
}: UserBlockedListProps) => {
  const { data: banInfo, isLoading } = useUserBanStatus(
    blocked.blocked_user_id,
  );

  return (
    <tr
      key={blocked.blocked_user_id}
      className="hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-6 py-4">
        <img
          src={getUserAvatar({
            author_profile_image: blocked.blocked_user_profile_image,
          })}
          alt={blocked.blocked_user_username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium">{blocked.blocked_user_id}</td>
      <td className="px-6 py-4 font-mono">{blocked.blocked_user_username}</td>
      <td className="px-6 py-4 text-gray-300">
        {blocked.blocked_user_first_name &&
        blocked.blocked_user_last_name ? (
          <span>
            {blocked.blocked_user_first_name}{" "}
            {blocked.blocked_user_last_name}
          </span>
        ) : (
          <span className="font-extrabold">&lt;Blank&gt;</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {blocked.blocked_user_email}
      </td>
      <td className="px-6 py-4">
        <UserRoleTag
          user={{ author_is_admin: blocked.blocked_user_is_admin }}
        />
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(blocked.blocked_user_registration_date)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(blocked.blocked_user_last_login_at)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDate(blocked.blocked_at)}
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
        <UserBlockedListActionDropdown
          blocked={blocked}
          userId={userId}
          username={username}
        />
      </td>
    </tr>
  );
};

export default UserBlockedRow;
