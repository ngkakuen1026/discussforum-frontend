import React from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { Ban, User, X } from "lucide-react";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";
import { useUserBan } from "../../../context/BanUserContext";
import { useUserBanStatus } from "../../../hooks/useUserBanStatus";
import { formatDate } from "../../../utils/dateUtils";

interface UnbanUserPopupProps {
  user: UserType;
  onClose: () => void;
}

const UnbanUserPopup = ({ user, onClose }: UnbanUserPopupProps) => {
  const { unbanUser, isUnbanning } = useUserBan();
  const { data: banInfo, isLoading: isBanLoading } = useUserBanStatus(user.id);

  console.log("Unbanpopup - Ban Info:", banInfo);
  const ban = banInfo?.ban;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    unbanUser(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <User size={18} />
              <h2 className="text-lg font-bold">Unban User</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={getUserAvatar(user)}
                alt={user.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
              />
              <div>
                <p className={`text-2xl font-bold ${getUsernameColor(user)}`}>
                  {user.username}
                </p>
                <p className="text-gray-400">ID: {user.id}</p>
              </div>
            </div>

            {/* Current Ban Information */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Ban size={18} />
                <span className="font-semibold">Current Ban Details</span>
              </div>

              {isBanLoading ? (
                <p className="text-gray-400">Loading ban details...</p>
              ) : ban ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ban Type:</span>
                    <span className="font-medium capitalize">
                      {ban.ban_type}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Banned Until:</span>
                    <span className="font-medium">
                      {formatDate(ban.banned_until)}
                    </span>
                  </div>

                  {ban.reason && (
                    <div>
                      <span className="text-gray-400 block mb-1">Reason:</span>
                      <p className="text-gray-300 bg-gray-900 p-3 rounded-lg">
                        {ban.reason}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-green-400">User is not currently banned.</p>
              )}
            </div>

            <div className=" text-gray-400 text-sm py-2">
              Are you sure you want to proceed? This will unban user{" "}
              <span className="font-semibold">{user.username}</span> and restore
              their access to the platform. Are you sure you want to proceed?
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isUnbanning}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUnbanning}
                className="cursor-pointer bg-linear-to-br from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUnbanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Unbanning...
                  </>
                ) : (
                  "Unban User"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default UnbanUserPopup;
