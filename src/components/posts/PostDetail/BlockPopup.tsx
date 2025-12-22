import React, { useState } from "react";
import ClickOutside from "../../../hooks/useClickOutside";
import { Ban, X } from "lucide-react";
import { toast } from "sonner";
import authAxios from "../../../services/authAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userBlockedAPI } from "../../../services/http-api";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";
import { isAxiosError } from "axios";

interface BlockPopupProps {
  userId: string | number;
  userName: string;
  userProfileImage: string | null;
  userGender: "Male" | "Female" | "Prefer Not to Say" | null;
  userIsAdmin: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BlockPopup = ({
  userId,
  userName,
  userProfileImage,
  userGender,
  userIsAdmin,
  onClose,
  onSuccess,
}: BlockPopupProps) => {
  const queryClient = useQueryClient();
  const [blockReason, setBlackReason] = useState("");

  const blockMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${userBlockedAPI.url}/block/${userId}`, {
        block_reason: blockReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blockeds"] });
      toast.success("User blocked!");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to block user.");
      if (isAxiosError(error)) {
        console.error(`User follow error: ${error}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    blockMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Ban size={24} className="text-red-500" />
              <h2 className="text-xl font-bold text-white">Block User</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} className="cursor-pointer" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center">
            <img
              src={getUserAvatar({
                author_profile_image: userProfileImage,
                gender: userGender,
              })}
              alt={userName}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-lg mb-2"
            />
            <p
              className={`font-bold text-xl ${getUsernameColor({
                author_is_admin: userIsAdmin,
                author_gender: userGender,
              })} flex items-center gap-2`}
            >
              <span className="text-2xl mb-1">{userName}</span>
              {userIsAdmin && (
                <span className="text-xs bg-yellow-600 px-3 py-1 rounded-lg font-medium">
                  Admin
                </span>
              )}
            </p>
            <p className="text-sm font-medium text-red-400">
              After blocking a user, you will no longer be able to see that
              user's posts and comments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for Blocking (optional)
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlackReason(e.target.value)}
                placeholder="Anything else you'd like to add..."
                className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <p className="text-gray-400 text-sm">
              The "Reason for Blocking" field allows you to check the reason for
              blocking this user later; it is not for reporting purposes.
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={blockMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {blockMutation.isPending ? "Blocking..." : "Block User"}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default BlockPopup;
