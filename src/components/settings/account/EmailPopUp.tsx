import React, { useEffect, useRef, useState } from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { Pencil, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
interface EmailPopUpProps {
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EmailPopUp = ({ currentUser, onClose, onSuccess }: EmailPopUpProps) => {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState(currentUser?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);

  const isEmailChanging = newEmail.trim() !== (currentUser?.email || "");

  const updateEmailMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        email: newEmail.trim(),
        currentPassword: isEmailChanging ? currentPassword : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Email updated successfully!");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      let message = "Update failed. Please try again";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: { message?: string } };
        };
        const status = axiosError.response?.status;
        const serverMessage = axiosError.response?.data?.message;
        switch (status) {
          case 400:
            message = "Current password is required to change email";
            setIsPasswordError(true);
            break;
          case 401:
            message = "Incorrect current password";
            setIsPasswordError(true);
            break;
          case 409:
            message = "This email is already in use by another account";
            setIsEmailError(true);
            break;
          case 500:
            message = "Server error. We're working on it";
            break;
          default:
            message = serverMessage || message;
        }
      }
      toast.error(message);
    },
  });

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      const input = emailInputRef.current;
      input.focus();

      const atIndex = input.value.indexOf("@");
      if (atIndex !== -1) {
        input.setSelectionRange(atIndex, atIndex);
      } else {
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    updateEmailMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={24} />
              <h2 className="text-xl font-bold text-white">Change Email</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={24} className="cursor-pointer" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Current Email
              </label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300">
                {currentUser?.email || "Not set"}
              </div>
            </div>

            <div>
              <label
                htmlFor="newEmail"
                className="block text-sm text-gray-300 mb-1"
              >
                New Email Address
              </label>
              <input
                id="newEmail"
                type="text"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                ref={emailInputRef}
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                }}
                placeholder="Enter your new email"
                className={`w-full ${isEmailError ? "border-red-500" : "border-gray-700"} bg-gray-800 border  rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition`}
                required
                autoFocus
              />
              <p className="mt-1.5 text-xs text-gray-500 italic">
                This will become your new login email. Password stays the same.
              </p>
            </div>

            {isEmailChanging && (
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm text-gray-300 mb-1"
                >
                  Current Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                    }}
                    placeholder="Enter your current password"
                    className={`w-full ${isPasswordError ? "border-red-500" : "border-gray-700"} bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition`}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  updateEmailMutation.isPending ||
                  !newEmail.trim() ||
                  (isEmailChanging && !currentPassword.trim())
                }
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {updateEmailMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default EmailPopUp;
