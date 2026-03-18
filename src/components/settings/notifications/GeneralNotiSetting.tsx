import { Switch } from "@headlessui/react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useUserNotiPreference } from "../../../context/UserNotiPreferenceContext";
import { useNotifications } from "../../../context/NotificationContext";

const GeneralNotiSetting = () => {
  const { preferences, setPreferences, isToggling, isLoading } =
    useUserNotiPreference();
  const { unreadCount, markAllAsRead, isMarkingAll } = useNotifications();

  const isMasterEnabled = preferences
    ? Object.values({
        follow_notifications: preferences.follow_notifications,
        post_notifications: preferences.post_notifications,
        comment_notifications: preferences.comment_notifications,
        comment_reply_notifications: preferences.comment_reply_notifications,
        like_notifications: preferences.like_notifications,
        mention_notifications: preferences.mention_notifications,
      }).some(Boolean)
    : true;

  const handleMasterToggle = (enable: boolean) => {
    const allUpdate = {
      follow_notifications: enable,
      unfollow_notifications: enable,
      post_notifications: enable,
      comment_notifications: enable,
      comment_reply_notifications: enable,
      like_notifications: enable,
      dislike_notifications: enable,
      mention_notifications: enable,
    };

    setPreferences(allUpdate)
      .then(() => {
        toast.success(`All notifications ${enable ? "enabled" : "muted"}`);
      })
      .catch(() => {
        toast.error("Failed to update master setting");
      });
  };

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">
        General Settings
      </h1>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-5 transition "
        onClick={() => handleMasterToggle(!isMasterEnabled)}
      >
        <div className="flex flex-col items-start">
          <p>Receive Notifications</p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={isMasterEnabled}
            onChange={handleMasterToggle}
            disabled={isToggling}
            className={`${
              isMasterEnabled ? "bg-cyan-600" : "bg-gray-600"
            } cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              className={`${
                isMasterEnabled
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {isMasterEnabled && (
                <Check
                  size={16}
                  className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                />
              )}
            </span>
          </Switch>
        </div>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 transition "
        onClick={() => markAllAsRead()}
      >
        <div className="flex flex-col items-start">
          <p>Mark all as read</p>
          <p className="text-sm text-gray-400 transition duration-200">
            {isMarkingAll ? "Marking..." : "Mark all notifications as read"}
          </p>
        </div>

        <button
          className="flex items-center rounded-full bg-gray-800 px-2 hover:bg-gray-600 tracking-tight transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed "
          onClick={() => markAllAsRead()}
          disabled={unreadCount === 0 || isMarkingAll}
        >
          <p className="p-2">{isMarkingAll ? "Marking..." : "Mark as read"}</p>
        </button>
      </div>
    </div>
  );
};

export default GeneralNotiSetting;
