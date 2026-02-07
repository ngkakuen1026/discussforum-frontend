import { useState, type FormEvent, type ReactNode } from "react";
import ClickOutside from "../../../hooks/useClickOutside";
import { Check, Globe, Lock, X, CircleQuestionMark } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";
import type { VisibilityModeType } from "../../../types/userTypes";

interface VisibilityModePopupProps {
  currentMode: VisibilityModeType;
  onClose: () => void;
}

const VisibilityModePopup = ({
  currentMode,
  onClose,
}: VisibilityModePopupProps) => {
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] =
    useState<VisibilityModeType>(currentMode);

  const modeOptions: {
    value: VisibilityModeType;
    label: string;
    desc: string;
    icon: ReactNode;
  }[] = [
    {
      value: "public",
      label: "Everyone",
      desc: "Anyone can view your profile and personal information.",
      icon: <Globe size={20} className="text-cyan-400" />,
    },
    {
      value: "private",
      label: "Private",
      desc: "Only you can see your profile and personal information.",
      icon: <Lock size={20} className="text-red-400" />,
    },
  ];

  const updateModeMutation = useMutation({
    mutationFn: (mode: VisibilityModeType) =>
      authAxios.patch(`${usersAPI.url}/profile/visibility`, {
        visibility_mode: mode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user-visibility"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Visibility mode updated");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update visibility mode");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedMode === currentMode) return;
    updateModeMutation.mutate(selectedMode);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Globe size={18} />
              <h2 className="text-lg font-bold">Profile Visibility</h2>
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
            <p className="text-white leading-relaxed">
              Choose who can view your profile and personal information.
            </p>
            <div className="flex gap-2">
              <CircleQuestionMark size={24} className="text-white transition" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Visibility mode only controls who can see your profile. To show
                or hide specific information, toggle the options outside the
                popup.
              </p>
            </div>

            <div className="space-y-3">
              {modeOptions.map((option) => {
                const isSelected = selectedMode === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-500/20"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`${isSelected ? "text-cyan-400" : "text-gray-500"}`}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${isSelected ? "text-white" : "text-gray-300"}`}
                        >
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {option.desc}
                        </p>
                      </div>
                    </div>

                    {/* Selected indicator */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-600"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>

                    <input
                      type="radio"
                      name="visibility_mode"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setSelectedMode(option.value)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={updateModeMutation.isPending}
                className="px-6 py-2 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-all hover:bg-white/10 backdrop-blur-xl disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  updateModeMutation.isPending || selectedMode === currentMode
                }
                className="px-6 py-2 bg-linear-to-br from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {updateModeMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default VisibilityModePopup;
