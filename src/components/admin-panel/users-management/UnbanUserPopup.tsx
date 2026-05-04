import React from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { User, X } from "lucide-react";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";
import { useUserBan } from "../../../context/BanUserContext";

interface UnbanUserPopupProps {
  user: UserType;
  onClose: () => void;
}

const UnbanUserPopup = ({ user, onClose }: UnbanUserPopupProps) => {

  const { unbanUser, isUnbanning } = useUserBan();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    unbanUser(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
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
            <p className="text-sm text-gray-400 leading-relaxed">
              This will unban user <span className="font-semibold">{user.username}</span> and restore their access to the platform. Are you sure you want to proceed?
            </p>
            <div className="flex justify-center">
              <img
                src={getUserAvatar(user)}
                alt="user avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">User ID: {user.id}</p>
              <p className={`font-semibold ${getUsernameColor(user)}`}>
                {user.username}
              </p>
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
