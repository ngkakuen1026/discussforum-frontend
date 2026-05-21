import { Ban, Check, X } from "lucide-react";
import { useUserBanStatus } from "../../../../../hooks/useUserBanStatus";
import type { UserType } from "../../../../../types/userTypes";
import { formatDate } from "../../../../../utils/dateUtils";
import UserPermissionActions from "./UserPermissionAction";

interface UserPermissionProps {
  user: UserType;
}

const UserPermission = ({ user }: UserPermissionProps) => {
  const { data: banInfo } = useUserBanStatus(user.id);

  const isBanned = banInfo?.isBanned ?? false;
  const ban = banInfo?.ban;

  const getStatus = (action: string) => {
    if (!isBanned)
      return { text: "Allowed", color: "text-green-400", icon: Check };
    if (ban?.ban_type === "all" || ban?.ban_type === action) {
      return { text: "Suspended", color: "text-red-400", icon: X };
    }
    return { text: "Allowed", color: "text-green-400", icon: Check };
  };

  return (
    <div>
      <UserPermissionActions user={user} />

      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between border border-gray-800 rounded-lg p-4 group">
          <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
            Post Creation
          </p>
          <div className="flex items-center gap-2">
            {(() => {
              const status = getStatus("post");
              const Icon = status.icon;
              return (
                <>
                  <Icon size={20} className={status.color} />
                  <span className={`${status.color} font-semibold`}>
                    {status.text}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        <div className="flex items-center justify-between border border-gray-800 rounded-lg p-4 group">
          <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
            Comment Creation
          </p>
          <div className="flex items-center gap-2">
            {(() => {
              const status = getStatus("comment");
              const Icon = status.icon;
              return (
                <>
                  <Icon size={20} className={status.color} />
                  <span className={`${status.color} font-semibold`}>
                    {status.text}
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        <div className="flex items-center justify-between border border-gray-800 rounded-lg p-4 group">
          <p className="text-gray-400 group-hover:text-white group-hover:text-lg transition-all duration-150">
            Interaction (Vote, Follow, etc.)
          </p>
          <div className="flex items-center gap-2">
            {(() => {
              const status = getStatus("interaction");
              const Icon = status.icon;
              return (
                <>
                  <Icon size={20} className={status.color} />
                  <span className={`${status.color} font-semibold`}>
                    {status.text}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Ban Details */}
      {isBanned && ban && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4 mt-6">
          <div className="flex items-center gap-2">
            <Ban size={18} />
            <span className="font-semibold">Current Ban Details</span>
          </div>

          <div className="space-y-3">
            <p className=" font-medium">
              <span>Ban Type: </span>
              <span className="font-medium capitalize">{ban.ban_type}</span>
            </p>

            <p className=" font-medium">
              <span className="text-red-400">Banned until: </span>
              <span className="text-white">{formatDate(ban.banned_until)}</span>
            </p>

            <div>
              <span className="text-gray-400 block mb-1">Reason:</span>
              <p className="text-gray-300 bg-gray-900 p-3 rounded-lg">
                {ban.reason}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermission;
