import type { UserBlockedType } from "../../types/userBlcokedTypes";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { formatDistanceToNow } from "date-fns";
import { CircleOff, EllipsisVertical } from "lucide-react";

interface BlockedUserListCardProps {
  blockedUser: UserBlockedType;
  onUnblock: () => void;
  isPending?: boolean;
}

const BlockedUserListCard = ({
  blockedUser,
  onUnblock,
  isPending,
}: BlockedUserListCardProps) => {
  return (
    <div className="group relative border-b border-gray-800/80 last:border-b-0 hover:bg-white/5 transition-all duration-200 cursor-pointer">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-cyan-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_180px] gap-8 px-4 py-6 items-start">
        <div className="flex flex-col items-center">
          <img
            src={getUserAvatar({
              author_profile_image: blockedUser.blocked_user_profile_image,
              gender: blockedUser.blocked_user_gender,
            })}
            alt={blockedUser.blocked_user_username}
            className="w-20 h-20 rounded-full ring-2 ring-gray-800 group-hover:ring-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm text-gray-400 ">
            <span
              className={`font-semibold ${getUsernameColor({
                author_is_admin: blockedUser.blocked_user_is_admin,
                author_gender: blockedUser.blocked_user_gender,
              })}`}
            >
              {blockedUser.blocked_user_username}
            </span>
            {blockedUser.blocked_user_is_admin && (
              <span className="px-2 py-0.5 text-xs bg-yellow-600/80 rounded-lg font-medium">
                Admin
              </span>
            )}
            <span className="text-gray-400">•</span>
            <time className="text-gray-400 hover:text-gray-300 transition">
              Blocked{" "}
              {blockedUser.user_blocked_at
                ? formatDistanceToNow(new Date(blockedUser.user_blocked_at), {
                    addSuffix: true,
                  })
                : "Recently"}
            </time>
          </div>
          <div className="text-gray-300 mt-2">
            Blocked Reason:{" "}
            {blockedUser.blocked_reason
              ? blockedUser.blocked_reason
              : "No Reason Provided"}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end justify-start">
          <EllipsisVertical
            size={18}
            className="text-gray-400 hover:text-white cursor-pointer"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnblock();
            }}
            disabled={isPending}
            className="flex items-end gap-2 text-red-500 hover:text-red-400 hover:bg-red-900/20 px-3 py-2 cursor-pointer rounded-lg transition text-sm font-medium"
          >
            <CircleOff size={18} />
            Unblock User
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserListCard;
