import { useState } from "react";
import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import type { UserType } from "../../../../../types/userTypes";
import BanUserPopup from "../../BanUserPopup";
import UnbanUserPopup from "../../UnbanUserPopup";
import { Ban, Unlock } from "lucide-react";

interface UserPermissionActionsProps {
  user: UserType;
}

const UserPermissionActions = ({ user }: UserPermissionActionsProps) => {
  const userId = user.id;
  const { data: banInfo } = useUserBanStatus(userId);

  const [showBanUserPopup, setShowBanUserPopup] = useState(false);
  const [showUnbanUserPopup, setShowUnbanUserPopup] = useState(false);

  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-4xl font-black adminHeading">User Permissions</h2>
      {banInfo?.isBanned ? (
        <button
          onClick={() => setShowUnbanUserPopup(true)}
          className={` relative group transition-all`}
        >
          <Unlock
            size={18}
            className="text-green-400 hover:text-green-200 cursor-pointer"
          />

          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
            Unban User
          </span>
        </button>
      ) : (
        <button
          onClick={() => setShowBanUserPopup(true)}
          className={` relative group transition-all`}
        >
          <Ban
            size={18}
            className="text-red-400 hover:text-red-200 cursor-pointer"
          />

          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
            Ban User
          </span>
        </button>
      )}

      {showBanUserPopup && (
        <BanUserPopup user={user} onClose={() => setShowBanUserPopup(false)} />
      )}

      {showUnbanUserPopup && (
        <UnbanUserPopup
          user={user}
          onClose={() => setShowUnbanUserPopup(false)}
        />
      )}
    </div>
  );
};

export default UserPermissionActions;
