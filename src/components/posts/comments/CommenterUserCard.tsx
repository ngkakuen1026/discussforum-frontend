import { useNavigate } from "@tanstack/react-router";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";
import { formatUserRegistrationDate } from "../../../utils/dateUtils";
import type { UserType } from "../../../types/userTypes";
import type { CommentType } from "../../../types/commentTypes";
import CommenterUserAction from "./CommenterUserAction";

interface CommenterUserCardProps {
  user: UserType | null;
  withAuth: (action: () => void) => () => void;
  comment: CommentType;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isBlocked: boolean;
  onShowBlockPopup: () => void;
  unBlockMutation: { mutate: () => void; isPending: boolean };
}

const CommenterUserCard = ({
  user,
  withAuth,
  comment,
  isFollowed,
  onToggleFollow,
  isBlocked,
  unBlockMutation,
  onShowBlockPopup,
}: CommenterUserCardProps) => {
  const navigate = useNavigate();
  return (
    <div className="col-span-3">
      <div className="flex flex-col items-center py-6">
        <img
          src={getUserAvatar(comment)}
          alt={comment.commenter_username}
          className="w-36 h-36 rounded-full object-cover border-4 border-gray-700 shadow-lg"
        />
        <div className="mt-4 text-left w-full pl-8">
          <p
            className={`font-bold text-xl ${getUsernameColor(comment)} flex items-center gap-2`}
          >
            <button
              onClick={() =>
                navigate({
                  to: "/public-profile/user/$userId",
                  params: { userId: comment.commenter_id.toString() },
                })
              }
              className="relative group cursor-pointer"
            >
              <span className="hover:opacity-80 transition">
                {comment.commenter_username}
              </span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                View {comment.commenter_username}'s profile
              </span>
            </button>
            {comment.commenter_is_admin && (
              <span className="text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                Admin
              </span>
            )}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Registered:{" "}
            {formatUserRegistrationDate(comment.commenter_registration_date)}
          </p>

          <CommenterUserAction
            user={user}
            withAuth={withAuth}
            comment={comment}
            isFollowed={isFollowed}
            onToggleFollow={onToggleFollow}
            isBlocked={isBlocked}
            onShowBlockPopup={onShowBlockPopup}
            unBlockMutation={unBlockMutation}
          />
        </div>
      </div>
    </div>
  );
};

export default CommenterUserCard;
