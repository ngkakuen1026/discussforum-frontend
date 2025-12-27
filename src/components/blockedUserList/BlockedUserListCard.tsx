import type { UserBlockedType } from "../../types/userBlcokedTypes";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import BlockedUserListActionDropdown from "./BlockedUserListActionDropdown";
import { UserRoleTag } from "../UserRoleTag";

interface BlockedUserListCardProps {
  blockedUser: UserBlockedType;
  onUnblock: () => void;
  isPending?: boolean;
  onOpenReasonPopup: () => void;
}

const BlockedUserListCard = ({
  blockedUser,
  onUnblock,
  isPending,
  onOpenReasonPopup,
}: BlockedUserListCardProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            <UserRoleTag
              user={{ author_is_admin: blockedUser.blocked_user_is_admin }}
            />
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
          <div className="text-gray-300 mt-2 break-all">
            Blocking Reason:{" "}
            {blockedUser.blocked_reason
              ? blockedUser.blocked_reason
              : "No Reason Provided"}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end justify-start relative">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-800/40"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((open) => !open);
            }}
          >
            <EllipsisVertical
              size={18}
              className="text-gray-400 hover:text-white cursor-pointer"
            />
          </button>
          {dropdownOpen && (
            <BlockedUserListActionDropdown
              isPending={isPending}
              onUnblock={onUnblock}
              onClose={() => setDropdownOpen(false)}
              onBlockReasonPopupOpen={onOpenReasonPopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockedUserListCard;
