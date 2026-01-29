import React, { useState } from "react";
import type { UserType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";

interface PhonePopupProps {
  currentUser: UserType | null;
  onClose: () => void;
}

const PhonePopup = ({ currentUser, onClose }: PhonePopupProps) => {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState(currentUser?.phone || "");

  const updateUsernameMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        phone: phone.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Phone updated successfully!");
      onClose();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUsernameMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={18} />
              <h2 className="text-lg font-bold text-white">Change Phone</h2>
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
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Current Phone
              </label>
              <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300">
                {currentUser?.phone || "Not Provided"}
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm text-gray-300 mb-1"
              >
                New Phone
              </label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                placeholder="Enter your new phone"
                className={`w-full border-gray-700 bg-gray-800 border  rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition`}
                required
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateUsernameMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updateUsernameMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Phone"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default PhonePopup;
