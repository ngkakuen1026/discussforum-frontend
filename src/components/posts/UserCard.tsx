import { useNavigate } from "@tanstack/react-router";
import type { UserType } from "../../types/userTypes";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { formatUserRegistrationDate } from "../../utils/dateUtils";
import type { UserLikeType } from "../../types/userLikeTypes";
import UserAction from "../UserAction";

interface UserCardProps {
  user: UserType | null;
  withAuth: (action: () => void) => () => void;
  userData: UserLikeType;
  isFollowed: boolean;
  onToggleFollow: () => void;
  isBlocked: boolean;
  onShowBlockPopup: () => void;
  unBlockMutation: { mutate: () => void; isPending: boolean };
  focusUserId: number | null;
  onFocusUser: (id: number | null) => void;
}

const UserCard = ({
  user,
  withAuth,
  userData,
  isFollowed,
  onToggleFollow,
  isBlocked,
  onShowBlockPopup,
  unBlockMutation,
  focusUserId,
  onFocusUser,
}: UserCardProps) => {
  const navigate = useNavigate();

  const userId = (userData.author_id ?? userData.commenter_id)!;
  const username = (userData.author_username ?? userData.commenter_username)!;
  const isAdmin =
    userData.author_is_admin ?? userData.commenter_is_admin ?? false;
  const registrationDate =
    userData.author_registration_date ??
    userData.commenter_registration_date ??
    "";

  return (
    <div className="col-span-3">
      <div className="flex flex-col items-center py-6">
        <img
          src={getUserAvatar(userData)}
          alt={username}
          className="w-36 h-36 rounded-full object-cover border-4 border-gray-700 shadow-lg"
        />
        <div className="mt-4 text-left w-full pl-8">
          <p
            className={`font-bold text-xl ${getUsernameColor(userData)} flex items-center gap-2`}
          >
            <button
              onClick={() =>
                navigate({
                  to: "/public-profile/user/$userId",
                  params: { userId: userId.toString() },
                })
              }
              className="relative group cursor-pointer"
            >
              <span className="hover:opacity-80 transition">{username}</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-50">
                View {username}'s profile
              </span>
            </button>
            {isAdmin && (
              <span className="text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                Admin
              </span>
            )}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Registered: {formatUserRegistrationDate(registrationDate)}
          </p>

          <UserAction
            currentUser={user}
            withAuth={withAuth}
            userData={userData}
            isFollowed={isFollowed}
            onToggleFollow={onToggleFollow}
            isBlocked={isBlocked}
            onShowBlockPopup={onShowBlockPopup}
            unBlockMutation={unBlockMutation}
            focusUserId={focusUserId}
            onFocusUser={onFocusUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
