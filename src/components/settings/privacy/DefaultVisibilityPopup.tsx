import React from "react";
import ClickOutside from "../../../hooks/useClickOutside";
import { Globe, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";
import { toast } from "sonner";

interface DefaultVisibilityPopupProps {
  onClose: () => void;
}

const DefaultVisibilityPopup = ({ onClose }: DefaultVisibilityPopupProps) => {
  const queryClient = useQueryClient();

  const resetDefaultVisibilityMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${usersAPI.url}/profile/visibility/reset`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user-visibility"] });
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      toast.success("Visibility reset to defaults");
      onClose();
    },
    onError: () => {
      toast.error("Failed to reset visibility");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetDefaultVisibilityMutation.mutate();
  };

  const defaultSettings = [
    { label: "Profile Visibility Mode", value: "Public (Everyone)" },
    { label: "Show Full Name", value: "Hidden" },
    { label: "Show Email", value: "Hidden" },
    { label: "Show Phone", value: "Hidden" },
    { label: "Show Gender", value: "Visible" },
    { label: "Show Bio", value: "Visible" },
    { label: "Show Registration Date", value: "Visible" },
    { label: "Show Last Login Date", value: "Hidden" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Globe size={18} />
              <h2 className="text-lg font-bold">Reset Visibility</h2>
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
            <p className="text-sm text-gray-400 leading-relaxed">
              This will reset all visibility settings to their default values:
            </p>

            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <ul className="space-y-2 text-sm">
                {defaultSettings.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span
                      className={`font-medium ${
                        item.value.includes("Hidden")
                          ? "text-red-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray-500 italic">
              You can always change these settings again later.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={resetDefaultVisibilityMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={resetDefaultVisibilityMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resetDefaultVisibilityMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset to Defaults"
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default DefaultVisibilityPopup;
