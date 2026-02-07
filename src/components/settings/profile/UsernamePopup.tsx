import React, { useState } from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { Pencil, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { usernameSchema } from "../../../schema/userDataSchema";
import { z } from "zod";
import axios from "axios";

interface UsernamePopupProps {
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const UsernamePopup = ({
  currentUser,
  onClose,
  onSuccess,
}: UsernamePopupProps) => {
  const queryClient = useQueryClient();
  const [newUsername, setNewUsername] = useState(currentUser?.username || "");
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateUsernameMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        username: newUsername.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Username updated successfully!");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      let message = "Update failed. Please try again.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  const validateUsername = (value: string): boolean => {
    const trimmed = value.trim();
    try {
      usernameSchema.parse(trimmed);
      setValidationError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError =
          err.issues?.[0]?.message ?? "Invalid username format";
        setValidationError(firstError);
        toast.error(firstError);
        return false;
      }
      setValidationError("Invalid username");
      toast.error("Invalid username");
      return false;
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewUsername(value);

    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateUsername(newUsername);

    if (!isValid) {
      return;
    }

    updateUsernameMutation.mutate();
  };

  const isPending = updateUsernameMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={18} />
              <h2 className="text-lg font-bold text-white">Change Username</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={18} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Current Username
              </label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300">
                {currentUser?.username || "Not set"}
              </div>
            </div>

            <div>
              <label
                htmlFor="newUsername"
                className="block text-sm text-gray-300 mb-1"
              >
                New Username
              </label>
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={handleOnChange}
                placeholder="Enter your new username"
                disabled={isPending}
                className={`w-full px-4 py-3 bg-gray-800 border ${
                  validationError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-cyan-500"
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition`}
                autoFocus
              />

              {validationError && (
                <p className="text-red-400 text-sm mt-1.5">{validationError}</p>
              )}

              <div className="text-right text-xs mt-1.5 text-gray-500">
                {newUsername.trim().length} / 20 characters
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Username"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default UsernamePopup;
