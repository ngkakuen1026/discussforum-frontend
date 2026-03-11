import ClickOutside from "../../../hooks/useClickOutside";
import { Check, Pencil, X } from "lucide-react";
import { Switch } from "@headlessui/react";
import { useUserNotiPreference } from "../../../context/UserNotiPreferenceContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

interface AdminNotiPopupProps {
  onClose: () => void;
}

const AdminNotiPopup = ({ onClose }: AdminNotiPopupProps) => {
  const { t } = useTranslation();
  const { preferences, togglePreference, isToggling, isLoading } =
    useUserNotiPreference();

  // Local preview state – starts with current saved preferences
  const [localPrefs, setLocalPrefs] = useState(() => {
    return {
      admin_profile_edit_notifications: true,
      admin_avatar_update_notifications: true,
      admin_avatar_delete_notifications: true,
      admin_user_delete_notifications: true,
      admin_post_delete_notifications: true,
      admin_comment_delete_notifications: true,
      admin_report_resolved_notifications: true,
      admin_tag_approved_notifications: true,
      admin_tag_deleted_notifications: true,
      admin_category_new_notifications: true,
      admin_category_edit_notifications: true,
      admin_category_delete_notifications: true,
      ...preferences,
    };
  });

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key: keyof typeof localPrefs) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Find all changed fields
    const changes: Partial<typeof localPrefs> = {};
    Object.keys(localPrefs).forEach((key) => {
      const typedKey = key as keyof typeof localPrefs;
      if (localPrefs[typedKey] !== preferences?.[typedKey]) {
        changes[typedKey] = localPrefs[typedKey];
      }
    });

    if (Object.keys(changes).length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    Promise.all(
      Object.entries(changes).map(([key, value]) =>
        togglePreference(key as keyof typeof localPrefs, value as boolean),
      ),
    )
      .then(() => {
        toast.success("Admin notification settings updated");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to update some settings");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <ClickOutside onClickOutside={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Pencil size={18} />
              <h2 className="text-lg font-bold text-white">
                Admin Notification Settings
              </h2>
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
            <div className="space-y-4">
              <p className="text-sm text-gray-400 leading-relaxed">
                We Strongly recommend you to turn all the admin notifications on
                to stay informed about important updates and actions taken by
                Admin on the forum.
              </p>

              <div className="space-y-3">
                {/* Profile Edit */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Edit your user profile</p>
                  </div>
                  <Switch
                    checked={localPrefs.admin_profile_edit_notifications}
                    onChange={() =>
                      handleToggle("admin_profile_edit_notifications")
                    }
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_profile_edit_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_profile_edit_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_profile_edit_notifications && (
                        <Check
                          size={16}
                          className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                        />
                      )}
                    </span>
                  </Switch>
                </div>

                {/* User Avatar */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Update or delete your user avatar</p>
                  </div>
                  <Switch
                    checked={
                      localPrefs.admin_avatar_update_notifications &&
                      localPrefs.admin_avatar_delete_notifications
                    }
                    onChange={() => {
                      handleToggle("admin_avatar_update_notifications");
                      handleToggle("admin_avatar_delete_notifications");
                    }}
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_avatar_update_notifications &&
                      localPrefs.admin_avatar_delete_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_avatar_update_notifications &&
                        localPrefs.admin_avatar_delete_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_avatar_update_notifications &&
                        localPrefs.admin_avatar_delete_notifications && (
                          <Check
                            size={16}
                            className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                          />
                        )}
                    </span>
                  </Switch>
                </div>

                {/* User banned */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>The user you follow has been banned</p>
                  </div>
                  <Switch
                    checked={localPrefs.admin_user_delete_notifications}
                    onChange={() =>
                      handleToggle("admin_user_delete_notifications")
                    }
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_user_delete_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_user_delete_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_user_delete_notifications && (
                        <Check
                          size={16}
                          className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                        />
                      )}
                    </span>
                  </Switch>
                </div>

                {/* Post deleted */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Post deleted</p>
                  </div>
                  <Switch
                    checked={localPrefs.admin_post_delete_notifications}
                    onChange={() =>
                      handleToggle("admin_post_delete_notifications")
                    }
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_post_delete_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_post_delete_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_post_delete_notifications && (
                        <Check
                          size={16}
                          className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                        />
                      )}
                    </span>
                  </Switch>
                </div>

                {/* Comment deleted */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Comment deleted</p>
                  </div>
                  <Switch
                    checked={localPrefs.admin_comment_delete_notifications}
                    onChange={() =>
                      handleToggle("admin_comment_delete_notifications")
                    }
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_comment_delete_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_comment_delete_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_comment_delete_notifications && (
                        <Check
                          size={16}
                          className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                        />
                      )}
                    </span>
                  </Switch>
                </div>

                {/* Report Resolved */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Report Resolved</p>
                  </div>
                  <Switch
                    checked={localPrefs.admin_report_resolved_notifications}
                    onChange={() =>
                      handleToggle("admin_report_resolved_notifications")
                    }
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_report_resolved_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_report_resolved_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_report_resolved_notifications && (
                        <Check
                          size={16}
                          className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                        />
                      )}
                    </span>
                  </Switch>
                </div>

                {/* Tag approved or deleted */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div>
                    <p>Tag approved or deleted</p>
                  </div>
                  <Switch
                    checked={
                      localPrefs.admin_tag_approved_notifications &&
                      localPrefs.admin_tag_deleted_notifications
                    }
                    onChange={() => {
                      handleToggle("admin_tag_approved_notifications");
                      handleToggle("admin_tag_deleted_notifications");
                    }}
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_tag_approved_notifications &&
                      localPrefs.admin_tag_deleted_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 cursor-pointer`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_tag_approved_notifications &&
                        localPrefs.admin_tag_deleted_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_tag_approved_notifications &&
                        localPrefs.admin_tag_deleted_notifications && (
                          <Check
                            size={16}
                            className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                          />
                        )}
                    </span>
                  </Switch>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between text-lg cursor-pointer py-5 transition ">
                  <div className="flex flex-col items-start">
                    <p>Category</p>
                    <p className="text-sm text-gray-400 transition duration-200">
                      Category created, updated or deleted.
                    </p>
                  </div>
                  <Switch
                    checked={
                      localPrefs.admin_category_new_notifications &&
                      localPrefs.admin_category_edit_notifications &&
                      localPrefs.admin_category_delete_notifications
                    }
                    onChange={() => {
                      handleToggle("admin_category_new_notifications");
                      handleToggle("admin_category_edit_notifications");
                      handleToggle("admin_category_delete_notifications");
                    }}
                    disabled={isToggling}
                    className={`${
                      localPrefs.admin_category_new_notifications &&
                      localPrefs.admin_category_edit_notifications &&
                      localPrefs.admin_category_delete_notifications
                        ? "bg-cyan-600"
                        : "bg-gray-600"
                    } relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50`}
                  >
                    <span
                      className={`${
                        localPrefs.admin_category_new_notifications &&
                        localPrefs.admin_category_edit_notifications &&
                        localPrefs.admin_category_delete_notifications
                          ? "translate-x-9 scale-110"
                          : "translate-x-1 scale-100"
                      } h-6 w-6 transform rounded-full bg-white shadow-md transition-all duration-300 ease-in-out flex items-center justify-center`}
                    >
                      {localPrefs.admin_category_new_notifications &&
                        localPrefs.admin_category_edit_notifications &&
                        localPrefs.admin_category_delete_notifications && (
                          <Check
                            size={16}
                            className="p-0.5 text-cyan-600 stroke-3 transition-transform duration-200"
                          />
                        )}
                    </span>
                  </Switch>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer border-2 border-white/30 hover:border-white/50 text-white font-bold py-2 px-6 rounded-2xl transition-all hover:bg-white/10 backdrop-blur-xl "
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="cursor-pointer bg-linear-to-br from-cyan-700 to-cyan-500 hover:from-cyan-600 hover:to-cyan-400 text-white font-bold py-2 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed "
              >
                {isToggling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  t("common.save")
                )}
              </button>
            </div>
          </form>
        </div>
      </ClickOutside>
    </div>
  );
};

export default AdminNotiPopup;
