import {
  Ban,
  CircleOff,
  Eye,
  MessageSquare,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { UserType } from "../../../types/userTypes";
import type { CommentType } from "../../../types/commentTypes";

interface CommenterUserActionProps {
  user: UserType | null;
  withAuth: (action: () => void) => () => void;
  comment: CommentType;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isBlocked: boolean;
  onShowBlockPopup: () => void;
  unBlockMutation: { mutate: () => void; isPending: boolean };
}

const CommenterUserAction = ({
  user,
  withAuth,
  comment,
  isFollowed,
  onToggleFollow,
  isBlocked,
  unBlockMutation,
  onShowBlockPopup,
}: CommenterUserActionProps) => {
  return (
    <div className="flex flex-col gap-2 text-gray-200 mt-4 text-sm space-y-1.5">
      <button className="flex items-center cursor-pointer hover:text-cyan-500 transition">
        <Eye size={18} />
        <span className="pl-2">Only show user's content</span>
      </button>
      {user?.id !== comment.commenter_id && (
        <button className="flex items-center cursor-pointer hover:text-cyan-500 transition">
          <MessageSquare size={18} />
          <span className="pl-2">Message User</span>
        </button>
      )}
      {user?.id !== comment.commenter_id && (
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
      {user?.id !== comment.commenter_id &&
        (isBlocked ? (
          <button
            onClick={withAuth(() => unBlockMutation.mutate())}
            disabled={unBlockMutation.isPending}
            className="flex items-center cursor-pointer hover:text-cyan-500 transition"
          >
            <CircleOff size={18} />
            <span className="pl-2">Unblock User</span>
          </button>
        ) : (
          <button
            onClick={withAuth(() => onShowBlockPopup())}
            className="flex items-center cursor-pointer hover:text-cyan-500 transition"
          >
            <Ban size={18} />
            <span className="pl-2">Block User</span>
          </button>
        ))}
    </div>
  );
};

export default CommenterUserAction;
