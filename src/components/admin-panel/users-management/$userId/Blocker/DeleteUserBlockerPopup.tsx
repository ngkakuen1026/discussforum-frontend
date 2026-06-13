import { UserMinus, X } from "lucide-react";
import ClickOutside from "../../../../../hooks/useClickOutside";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../../../services/authAxios";
import { adminAPI } from "../../../../../services/http-api";
import { toast } from "sonner";
import {
  getUserAvatar,
  getUsernameColor,
} from "../../../../../utils/userUtils";
import type { UserBlockerType } from "../../../../../types/userBlcokedTypes";

interface DeleteUserBlockerPopupProps {
  blocker: UserBlockerType;
  userId: string;
  username: string;
  onClose: () => void;
}

const DeleteUserBlockerPopup = ({
  blocker,
  userId,
  username,
  onClose,
}: DeleteUserBlockerPopupProps) => {
  const queryClient = useQueryClient();
  // Delete User Mutation
  const deleteUserBlockerMutation = useMutation({
    mutationFn: async () => {
      await authAxios.delete(
        `${adminAPI.url}/user-following/${userId}/remove/blockers/${blocker.blocker_user_id}`,
      );
    },
    onSuccess: () => {
      toast.success(
        `Blocker ${blocker.blocker_user_username} has been removed from ${username} blockers list`,
      );
      queryClient.invalidateQueries({
        queryKey: ["admin-user-blockers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-user-blockers",],
      });
      onClose();
    },
    onError: () => {
      toast.error("Failed to remove blocker");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteUserBlockerMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <UserMinus size={18} />
              <h2 className="text-lg font-bold">Remove User Blocker</h2>
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
              This will remove blocker{" "}
              <span
                className={`${getUsernameColor({ author_is_admin: blocker.blocker_user_is_admin, author_gender: blocker.blocker_user_gender })} font-semibold`}
              >
                {blocker.blocker_user_username}
              </span>{" "}
              from {username}'s blockers list. Are you sure you want to
              proceed?
            </p>
            <div className="flex justify-center">
              <img
                src={getUserAvatar({
                  author_profile_image: blocker.blocker_user_profile_image,
                })}
                alt="user avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">
                User ID: {blocker.blocker_user_id}
              </p>
              <p className={`font-semibold`}>
                Username:{" "}
                <span
                  className={getUsernameColor({
                    author_is_admin: blocker.blocker_user_is_admin,
                    author_gender: blocker.blocker_user_gender,
                  })}
                >
                  {blocker.blocker_user_username}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={deleteUserBlockerMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={deleteUserBlockerMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleteUserBlockerMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Remove Blocker"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DeleteUserBlockerPopup;
