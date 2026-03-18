import { Switch } from "@headlessui/react";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import AdminNotiPopup from "./AdminNotiPopup";
import { useUserNotiPreference } from "../../../context/UserNotiPreferenceContext";
import DefaultNotificationsPopup from "./DefaultNotificationsPopup";

const ActivityNotiSetting = () => {
  const { preferences, togglePreference, isToggling, isLoading } =
    useUserNotiPreference();
  const [showAdminNotiPopup, setShowAdminNotiPopup] = useState(false);
  const [showDefaultNotificationPopup, setShowDefaultVisibilityPopup] =
    useState(false);

  return (
    <div className="mt-4">
      <h1 className="text-white text-2xl pb-4 font-semibold">
        Forum Activity Settings
      </h1>

      {/* Admin Action Popup */}
      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/adminAction transition"
        onClick={() => setShowAdminNotiPopup(true)}
      >
        <div className="flex flex-col items-start">
          <p>Admin Actions</p>
        </div>

        <div className="flex items-center">
          <button className="group-hover/adminAction:bg-gray-700 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mention of your username */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-3 transition ">
        <div>
          <p className="text-lg">Mention of your username</p>
          <p className="text-sm text-gray-400">In posts or comments</p>
        </div>
        <Switch
          checked={preferences?.mention_notifications ?? true}
          onChange={(checked) =>
            togglePreference("mention_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.mention_notifications ? "bg-cyan-600" : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.mention_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.mention_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      {/* Comment on your post */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
        <div>
          <p className="text-lg">Comment on your post</p>
        </div>
        <Switch
          checked={preferences?.comment_notifications ?? true}
          onChange={(checked) =>
            togglePreference("comment_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.comment_notifications ? "bg-cyan-600" : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.comment_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.comment_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      {/* Reply to your comment */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
        <div>
          <p className="text-lg">Reply to your comment</p>
        </div>
        <Switch
          checked={preferences?.comment_reply_notifications ?? true}
          onChange={(checked) =>
            togglePreference("comment_reply_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.comment_reply_notifications
              ? "bg-cyan-600"
              : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.comment_reply_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.comment_reply_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      {/* Upvote or downvote on your posts or comments */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
        <div className="flex flex-col items-start">
          <p>Upvote or downvote on your posts or comments</p>
        </div>

        <div className="flex items-center">
          <Switch
            checked={
              (preferences?.like_notifications ?? true) &&
              (preferences?.dislike_notifications ?? true)
            }
            onChange={(checked) => {
              togglePreference("like_notifications", checked);
              togglePreference("dislike_notifications", checked);
            }}
            disabled={isToggling}
            className={`${
              preferences?.like_notifications &&
              preferences?.dislike_notifications
                ? "bg-cyan-600"
                : "bg-gray-600"
            } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
          >
            <span
              className={`${
                preferences?.like_notifications &&
                preferences?.dislike_notifications
                  ? "translate-x-9 scale-110"
                  : "translate-x-1 scale-100"
              } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
            >
              {preferences?.like_notifications &&
                preferences?.dislike_notifications && (
                  <Check
                    size={16}
                    className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                  />
                )}
            </span>
          </Switch>
        </div>
      </div>

      {/* New followers */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-3 transition ">
        <div>
          <p className="text-lg">New followers</p>
          <p className="text-sm text-gray-400">When someone follows you</p>
        </div>
        <Switch
          checked={preferences?.follow_notifications ?? true}
          onChange={(checked) =>
            togglePreference("follow_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.follow_notifications ? "bg-cyan-600" : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.follow_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.follow_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      {/* User unfollow you */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-3 transition ">
        <div>
          <p className="text-lg">Follower lost</p>
          <p className="text-sm text-gray-400">When someone unfollows you</p>
        </div>
        <Switch
          checked={preferences?.unfollow_notifications ?? true}
          onChange={(checked) =>
            togglePreference("unfollow_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.unfollow_notifications ? "bg-cyan-600" : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.unfollow_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.unfollow_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      {/* Activity from user you follow */}
      <div className="flex items-center justify-between text-lg cursor-pointer py-3 transition ">
        <div>
          <p>Activity from user you follow</p>
          <p className="text-sm text-gray-400 transition duration-200">
            When someone you follow creates a new post
          </p>
        </div>
        <Switch
          checked={preferences?.post_notifications ?? true}
          onChange={(checked) =>
            togglePreference("post_notifications", checked)
          }
          disabled={isToggling}
          className={`${
            preferences?.post_notifications ? "bg-cyan-600" : "bg-gray-600"
          } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
        >
          <span
            className={`${
              preferences?.post_notifications
                ? "translate-x-9 scale-110"
                : "translate-x-1 scale-100"
            } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
          >
            {preferences?.post_notifications && (
              <Check
                size={16}
                className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
              />
            )}
          </span>
        </Switch>
      </div>

      <div
        className="flex items-center justify-between text-lg cursor-pointer py-3 rounded-md group/delete-account"
        onClick={() => setShowDefaultVisibilityPopup(true)}
      >
        <p className="text-red-400">Reset to Default Notification Settings</p>
        <div className="flex items-center justify-around">
          <button className="group-hover/delete-account:bg-red-800 text-red-400 rounded-full p-4 cursor-pointer transition duration-200">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {showAdminNotiPopup && (
        <AdminNotiPopup onClose={() => setShowAdminNotiPopup(false)} />
      )}

      {showDefaultNotificationPopup && (
        <DefaultNotificationsPopup
          onClose={() => setShowDefaultVisibilityPopup(false)}
        />
      )}
    </div>
  );
};

export default ActivityNotiSetting;
