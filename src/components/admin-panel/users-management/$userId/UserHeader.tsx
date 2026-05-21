import { UserRoleTag } from "../../../UserRoleTag";
import type { UserType } from "../../../../types/userTypes";
import { getUserAvatar } from "../../../../utils/userUtils";
import UserHeaderDropdown from "./UserHeaderDropdown";
import { Navigation, RefreshCcw } from "lucide-react";
import { BannedTag } from "../BannedTag";
import { Link } from "@tanstack/react-router";

interface UserHeaderProps {
  user: UserType;
  refreshUserData: () => void;
}

const UserHeader = ({ user, refreshUserData }: UserHeaderProps) => {
  return (
    <div className="p-8 border-b border-gray-800 flex justify-between gap-6">
      <div className="flex items-center gap-6">
        <img
          src={getUserAvatar(user)}
          alt={user.username}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
        />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-400 mt-1">
            {user.first_name} {user.last_name}
          </p>
          <div className="mt-2 flex gap-2 items-center">
            <UserRoleTag user={user} />
            <BannedTag user={user} />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <button
          onClick={refreshUserData}
          className="relative group cursor-pointer"
        >
          <RefreshCcw
            size={18}
            className="text-gray-400 hover:text-gray-200 cursor-pointer "
          />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-99">
            Refresh User Data
          </span>
        </button>

        <Link
          to="/public-profile/user/$userId"
          params={{ userId: user.id.toString() }}
          className="relative group cursor-pointer"
        >
          <Navigation
            size={18}
            className="text-gray-400 hover:text-gray-200 cursor-pointer "
          />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-99">
            Go to User Profile
          </span>
        </Link>

        <UserHeaderDropdown user={user} />
      </div>
    </div>
  );
};

export default UserHeader;
