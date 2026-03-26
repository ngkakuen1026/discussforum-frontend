import {
  ListMinus,
  Trash2,
  RefreshCcw,
  X,
  MousePointer,
  BookCheck,
  Settings,
} from "lucide-react";
import type { notificationType } from "../../types/notiTypes";
import { useNavigate } from "@tanstack/react-router";

interface NotificationToolbarProps {
  unreadCount: number;
  isMarkingAll: boolean;
  refetch: () => void;
  markAllAsRead: () => Promise<void>;
  selectMode: boolean;
  selectedNotificationIds: number[];
  notifications: notificationType[];
  toggleSelectMode: () => void;
  selectAll: () => void;
  deleteSelected: () => void;
}

const NotificationToolbar = ({
  unreadCount,
  isMarkingAll,
  refetch,
  markAllAsRead,
  selectMode,
  selectedNotificationIds,
  notifications,
  toggleSelectMode,
  selectAll,
  deleteSelected,
}: NotificationToolbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-white text-2xl font-bold">
          Notifications ({notifications.length})
        </h1>
        {selectMode ? (
          <div className="flex gap-2 ">
            <button
              onClick={selectAll}
              className="relative group transition-all"
            >
              <MousePointer
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                {selectedNotificationIds.length === notifications.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </button>
            <button
              onClick={deleteSelected}
              disabled={selectedNotificationIds.length === 0}
              className="relative group transition-all"
            >
              <Trash2
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Delete ({selectedNotificationIds.length})
              </span>
            </button>
            <button
              onClick={toggleSelectMode}
              className="relative group transition-all"
            >
              <X
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Cancel
              </span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2 ">
            <button
              onClick={toggleSelectMode}
              className="relative group transition-all"
            >
              <ListMinus
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Select multiple to delete
              </span>
            </button>
            <button onClick={refetch} className="relative group transition-all">
              <RefreshCcw
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Refresh
              </span>
            </button>
            {!selectMode && (
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || isMarkingAll}
                className="relative group transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                <BookCheck
                  size={18}
                  className="text-gray-400 hover:text-white"
                />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                  {isMarkingAll ? "Marking..." : "Mark All as Read"}
                </span>
              </button>
            )}
            <button
              onClick={() => navigate({ to: "/settings/notifications" })}
              className="relative group transition-all"
            >
              <Settings
                size={18}
                className="text-gray-400 hover:text-white cursor-pointer"
              />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap border border-gray-700 shadow-xl z-10">
                Go to notification settings
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <h2 className={`text-gray-400 mt-2`}>
          {selectMode
            ? `${selectedNotificationIds.length} notification${selectedNotificationIds.length > 1 ? "s" : ""} selected`
            : `Unread Notifications: ${unreadCount}`}
        </h2>
      </div>
    </div>
  );
};

export default NotificationToolbar;
