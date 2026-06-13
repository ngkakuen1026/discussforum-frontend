import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import { getUserAvatar } from "../../../../../utils/userUtils";
import { UserRoleTag } from "../../../../UserRoleTag";
import { formatDate, formatUserRegistrationDate } from "../../../../../utils/dateUtils";
import UserBlockerListActionDropdown from "./UserBlockerListActionDropdown";
import type { UserBlockerType } from "../../../../../types/userBlcokedTypes";

interface UserBlockerListProps {
  blocker: UserBlockerType;
  userId: string;
  username: string;
}

const UserBlockerRow = ({
  blocker,
  userId,
  username,
}: UserBlockerListProps) => {
  const { data: banInfo, isLoading } = useUserBanStatus(
    blocker.blocker_user_id,
  );

  return (
    <tr
      key={blocker.blocker_user_id}
      className="hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-6 py-4">
        <img
          src={getUserAvatar({
            author_profile_image: blocker.blocker_user_profile_image,
          })}
          alt={blocker.blocker_user_username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium">{blocker.blocker_user_id}</td>
      <td className="px-6 py-4 font-mono">{blocker.blocker_user_username}</td>
      <td className="px-6 py-4 text-gray-300">
        {blocker.blocker_user_first_name &&
        blocker.blocker_user_last_name ? (
          <span>
            {blocker.blocker_user_first_name}{" "}
            {blocker.blocker_user_last_name}
          </span>
        ) : (
          <span className="font-extrabold">&lt;Blank&gt;</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {blocker.blocker_user_email}
      </td>
      <td className="px-6 py-4">
        <UserRoleTag
          user={{ author_is_admin: blocker.blocker_user_is_admin }}
        />
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(blocker.blocker_user_registration_date)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(blocker.blocker_user_last_login_at)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDate(blocker.blocked_at)}
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
        <UserBlockerListActionDropdown
          blocker={blocker}
          userId={userId}
          username={username}
        />
      </td>
    </tr>
  );
};

export default UserBlockerRow;
