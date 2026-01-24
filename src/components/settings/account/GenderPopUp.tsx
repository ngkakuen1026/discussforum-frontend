import React, { useState } from "react";
import type { UserType, GenderType } from "../../../types/userTypes";
import ClickOutside from "../../../hooks/useClickOutside";
import { Pencil, X, Check } from "lucide-react"; // ← Add Check icon
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

interface GenderPopUpProps {
  currentUser: UserType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const GenderPopUp = ({ currentUser, onClose, onSuccess }: GenderPopUpProps) => {
  const queryClient = useQueryClient();

  const DEFAULT_GENDER: GenderType = "Prefer Not to Say";

  const [gender, setGender] = useState<GenderType | undefined>(
    currentUser?.gender ?? DEFAULT_GENDER,
  );

  const updateGenderMutation = useMutation({
    mutationFn: () =>
      authAxios.patch(`${usersAPI.url}/profile/me`, {
        gender,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Gender updated successfully!");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      let message = "Failed to update gender.";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGenderMutation.mutate();
  };

  const genderOptions: { value: GenderType; label: string }[] = [
    { value: "Female", label: "Female" },
    { value: "Male", label: "Male" },
    { value: "Prefer Not to Say", label: "Prefer Not to Say" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={24} />
              <h2 className="text-xl font-bold text-white">Update Gender</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
              aria-label="Close"
            >
              <X size={24} className="cursor-pointer" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                Changing your gender will also update your badge and username
                colors.
              </p>

              <div className="space-y-3">
                {genderOptions.map((option) => {
                  const isSelected = gender === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
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
                        name="gender"
                        value={option.value}
                        checked={isSelected}
                        onChange={() => setGender(option.value)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

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
                disabled={updateGenderMutation.isPending || !gender}
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {updateGenderMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Gender"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default GenderPopUp;
