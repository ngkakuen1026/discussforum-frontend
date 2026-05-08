import React from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import authAxios from "../../../services/authAxios";
import { adminAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, X } from "lucide-react";
import { getUserAvatar, getUsernameColor } from "../../../utils/userUtils";

interface DeleteUserPopupProps {
  user: UserType;
  onClose: () => void;
}

const DeleteUserPopup = ({ user, onClose }: DeleteUserPopupProps) => {
  const queryClient = useQueryClient();
  // Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await authAxios.delete(`${adminAPI.url}/users/user/profile/${user.id}`);
    },
    onSuccess: () => {
      toast.success(`User ${user.username} has been deleted`);
      queryClient.invalidateQueries({ queryKey: ["admin-all-users"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteUserMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Trash2 size={18} />
              <h2 className="text-lg font-bold">Delete User</h2>
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
              This will delete user{" "}
              <span className={`${getUsernameColor(user)} font-semibold`}>
                {user.username}
              </span>{" "}
              and remove their associated data from the platform. This action
              cannot be undone. Are you sure you want to proceed?
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
              <p className={`font-semibold`}>
                Username:{" "}
                <span className={getUsernameColor(user)}>{user.username}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={deleteUserMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={deleteUserMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleteUserMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DeleteUserPopup;
