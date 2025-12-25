import ClickOutside from "../../hooks/useClickOutside";
import { User, X } from "lucide-react";
import { getUserAvatar, getUsernameColor } from "../../utils/userUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import authAxios from "../../services/authAxios";
import { userBlockedAPI } from "../../services/http-api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

interface BlockPopupProps {
  userId: number;
  userName: string;
  userProfileImage: string | null;
  userGender: "Male" | "Female" | "Prefer Not to Say" | null;
  userIsAdmin: boolean;
  userBlockedReason: string;
  onClose: () => void;
}

const BlockedReasonPopup = ({
  userId,
  userName,
  userProfileImage,
  userGender,
  userIsAdmin,
  userBlockedReason,
  onClose,
}: BlockPopupProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [blockReason, setBlackReason] = useState(`${userBlockedReason}`);

  const updateBlockReasonMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${userBlockedAPI.url}/block/${userId}`, {
        block_reason: blockReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blockeds"] });
      toast.success(`Blocking Reason updated for user ${userName}`);
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update block reason.");
      if (isAxiosError(error)) {
        console.error(`Updating Block Reason Error: ${error}`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBlockReasonMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <User size={24} className="text-white" />
              <h2 className="text-xl font-bold text-white">
                Blocked User Data
              </h2>
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
            <p className="text-lg font-medium text-gray-300 mt-2">
              Blocking Reason:{" "}
              <span className="text-red-500 break-all">
                {userBlockedReason ? userBlockedReason : "No Reason Provided"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Update Reason for Blocking
              </label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlackReason(e.target.value)}
                placeholder="Reason for Blocking (optional)"
                className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() =>
                  navigate({ to: `/public-profile/user/${userId}` })
                }
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                Go to Profile
              </button>
              <button
                type="submit"
                disabled={updateBlockReasonMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {updateBlockReasonMutation.isPending
                  ? "Updating..."
                  : "Update Reason"}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default BlockedReasonPopup;
