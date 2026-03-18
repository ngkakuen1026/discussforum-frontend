import { Pencil, X } from "lucide-react";
import ClickOutside from "../../../hooks/useClickOutside";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import authAxios from "../../../services/authAxios";
import { usersAPI } from "../../../services/http-api";

interface DefaultNotificationsPopupProps {
  onClose: () => void;
}

const DefaultNotificationsPopup = ({
  onClose,
}: DefaultNotificationsPopupProps) => {
  const queryClient = useQueryClient();

  const resetDefaultNotificationMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${usersAPI.url}/notification-preferences/reset`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth-user-notification-preferences"],
      });
      toast.success("Notification setting reset to defaults");
      onClose();
    },
    onError: () => {
      toast.error("Failed to reset notification setting");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetDefaultNotificationMutation.mutate();
  };

  const defaultSettings = [
    { label: "Receive All Notifications", value: "True" },
    { label: "Edit your user profile", value: "True" },
    { label: "Update or delete your user avatar", value: "True" },
    { label: "The user you follow has been banned", value: "True" },
    { label: "Post deleted", value: "True" },
    { label: "Report resolved", value: "True" },
    { label: "Tag approved or deleted", value: "True" },
    { label: "Category created, updated or deleted", value: "True" },
    { label: "Mention of your username", value: "True" },
    { label: "Comment on your post", value: "True" },
    { label: "Reply to your comment", value: "True" },
    { label: "Upvote or downvote on your posts or comments", value: "True" },
    { label: "New followers", value: "True" },
    { label: "Follower lost", value: "False" },
    { label: "Activity from user you follow", value: "True" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3 text-white">
              <Pencil size={18} />
              <h2 className="text-lg font-bold">Reset Notification Settings</h2>
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
              This will reset all notification settings to their default values:
            </p>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
              <ul className="space-y-2 text-sm p-4">
                {defaultSettings.map((item, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-300">{item.label}</span>
                    <span
                      className={`font-medium ${
                        item.value.includes("False")
                          ? "text-red-400"
                          : "text-green-400"
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
                disabled={resetDefaultNotificationMutation.isPending}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={resetDefaultNotificationMutation.isPending}
                className="cursor-pointer bg-linear-to-br from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resetDefaultNotificationMutation.isPending ? (
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

export default DefaultNotificationsPopup;
