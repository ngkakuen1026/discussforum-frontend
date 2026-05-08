import { useUserBanStatus } from "../../../hooks/useUserBanStatus";
import { Link } from "@tanstack/react-router";
import { getUserAvatar } from "../../../utils/userUtils";
import { UserRoleTag } from "../../UserRoleTag";
import UsersActionDropdown from "./UsersActionDropdown";
import {
  formatUserLastLoginDate,
  formatUserRegistrationDate,
} from "../../../utils/dateUtils";
import type { UserType } from "../../../types/userTypes";

const UserRow = ({ user }: { user: UserType }) => {
  const { data: banInfo, isLoading } = useUserBanStatus(user.id);

  return (
    <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">
        <img
          src={getUserAvatar(user)}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium">{user.id}</td>
      <td className="px-6 py-4 font-mono">
        <Link
          to={`/admin-panel/users-management/$userId`}
          params={{ userId: user.id.toString() }}
          className="hover:text-gray-600 transition-colors cursor-pointer rounded"
        >
          {user.username}
        </Link>
      </td>
      <td className="px-6 py-4 text-gray-300">
        {user?.first_name && user.last_name ? (
          <span>
            {user.first_name} {user.last_name}
          </span>
        ) : (
          <span className="font-extrabold">&lt;Blank&gt;</span>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">{user.email}</td>
      <td className="px-6 py-4">
        <UserRoleTag user={user} />
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserRegistrationDate(user.registration_date)}
      </td>
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatUserLastLoginDate(user.last_login_at)}
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
        <UsersActionDropdown user={user} />
      </td>
    </tr>
  );
};

export default UserRow;
