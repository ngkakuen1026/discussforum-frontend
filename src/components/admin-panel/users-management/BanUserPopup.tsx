import React, { useState } from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { User, X, Loader2, Check } from "lucide-react";
import { getUserAvatar } from "../../../utils/userUtils";
import { useUserBan } from "../../../context/BanUserContext";
import { UserRoleTag } from "../../UserRoleTag";

interface BanUserPopupProps {
  user: UserType;
  onClose: () => void;
}

const BanUserPopup = ({ user, onClose }: BanUserPopupProps) => {
  const { banUser, isBanning } = useUserBan();

  const [durationHours, setDurationHours] = useState(24);
  const [banType, setBanType] = useState<
    "post" | "comment" | "interaction" | "all"
  >("all");
  const [reason, setReason] = useState("");

  const durationOptions = [
    { label: "1 Hour", value: 1 },
    { label: "6 Hours", value: 6 },
    { label: "1 Day", value: 24 },
    { label: "3 Days", value: 72 },
    { label: "7 Days", value: 168 },
    { label: "30 Days", value: 720 },
  ];

  const selectedDurationLabel =
    durationOptions.find((option) => option.value === durationHours)?.label ||
    `${durationHours} Hours`;

  const banTypeOptions = [
    {
      value: "post",
      label: "Ban from Posting",
      desc: "Cannot create or edit posts",
    },
    {
      value: "comment",
      label: "Ban from Commenting",
      desc: "Cannot comment or reply",
    },
    {
      value: "interaction",
      label: "Ban from Interactions",
      desc: "Cannot vote, follow, report, etc.",
    },
    {
      value: "all",
      label: "Full Ban (All Activities)",
      desc: "Complete platform restriction",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    banUser(user.id, durationHours, banType, reason.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <User size={18} />
              <h2 className="text-lg font-bold">Ban User</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={getUserAvatar(user)}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover border border-gray-700"
              />
              <div>
                <p className="font-semibold text-lg">{user.username}</p>
                <p className="text-gray-400 text-sm">User ID: {user.id}</p>
                <UserRoleTag user={user} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ban Type
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {banTypeOptions.map((option) => {
                    const isSelected = banType === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-950/40"
                            : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                        }`}
                      >
                        <span className="text-gray-200 font-medium flex-1">
                          {option.label}
                        </span>

                        <div
                          className={`w-6 h-6 flex items-center justify-center transition-all `}
                        >
                          {isSelected && (
                            <Check size={16} className="text-cyan-400" />
                          )}
                        </div>

                        <input
                          type="radio"
                          name="banType"
                          checked={isSelected}
                          onChange={() =>
                            setBanType(option.value as typeof banType)
                          }
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Ban Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {durationOptions.map((option) => {
                    const isSelected = durationHours === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDurationHours(option.value)}
                        className={`py-3 px-4 rounded-xl  font-medium transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-red-600 border-red-500 text-white"
                            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for ban..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm resize-y min-h-20 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isBanning}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isBanning}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed "
              >
                {isBanning ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Banning...
                  </>
                ) : (
                  `Ban User (${selectedDurationLabel})`
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default BanUserPopup;
