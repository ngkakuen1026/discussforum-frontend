import {
  Ban,
  CircleOff,
  Eye,
  MessageSquare,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { UserType } from "../types/userTypes";
import type { UserLikeType } from "../types/userLikeTypes";

interface UserActionProps {
  currentUser: UserType | null;
  withAuth: (action: () => void) => () => void;
  userData: UserLikeType;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isBlocked: boolean;
  onShowBlockPopup: () => void;
  unBlockMutation: { mutate: () => void; isPending: boolean };
  onFocusUser?: (userId: number) => void;
}

const UserAction = ({
  currentUser,
  withAuth,
  userData,
  isFollowed,
  onToggleFollow,
  isBlocked,
  onShowBlockPopup,
  unBlockMutation,
  onFocusUser,
}: UserActionProps) => {
  const targetUserId = Number(userData.author_id ?? userData.commenter_id);

  const isOwnProfile = currentUser?.id === targetUserId;

  return (
    <div className="flex flex-col gap-2 text-gray-200 mt-4 text-sm space-y-1.5">
      <button
        onClick={() => onFocusUser?.(targetUserId)}
        className="flex items-center cursor-pointer hover:text-cyan-500 transition"
      >
        <Eye size={18} />
        <span className="pl-2">Only show user's content</span>
      </button>

      {!isOwnProfile && (
        <button className="flex items-center cursor-pointer hover:text-cyan-500 transition">
          <MessageSquare size={18} />
          <span className="pl-2">Message User</span>
        </button>
      )}

      {!isOwnProfile && (
        <button
          onClick={withAuth(onToggleFollow)}
          className="flex items-center cursor-pointer hover:text-cyan-500 transition"
        >
          {isFollowed ? <UserMinus size={18} /> : <UserPlus size={18} />}
          <span className="pl-2">
            {isFollowed ? "Unfollow User" : "Follow User"}
          </span>
        </button>
      )}

      {!isOwnProfile &&
        (isBlocked ? (
          <button
            onClick={withAuth(() => unBlockMutation.mutate())}
            disabled={unBlockMutation.isPending}
            className="flex items-center cursor-pointer hover:text-green-400 transition"
          >
            <CircleOff size={18} />
            <span className="pl-2">Unblock User</span>
          </button>
        ) : (
          <button
            onClick={withAuth(onShowBlockPopup)}
            className="flex items-center cursor-pointer hover:text-red-400 transition"
          >
            <Ban size={18} />
            <span className="pl-2">Block User</span>
          </button>
        ))}
    </div>
  );
};

export default UserAction;
