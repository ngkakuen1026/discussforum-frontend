import type { UserFollowType } from "../../types/userFollowTypes";
import { RefreshCcw } from "lucide-react";

interface UserFollowingToolbarProps {
  followingUsers: UserFollowType[];
  refreshMyFollowing: () => void;
}

const UserFollowingToolbar = ({
  followingUsers,
  refreshMyFollowing,
}: UserFollowingToolbarProps) => {
  return (
    <div className="">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-white text-2xl font-bold">
          My Following User ({followingUsers.length})
        </h1>

        <div className="flex gap-2 ">
          <button
            onClick={refreshMyFollowing}
            className="relative group transition-all"
          >
            <RefreshCcw
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
              Refresh
            </span>
          </button>
        </div>
      </div>
      <div>
        <h2 className={`text-gray-400 mt-2`}>The user following</h2>
      </div>
    </div>
  );
};

export default UserFollowingToolbar;
