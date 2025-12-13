import { useNavigate } from "@tanstack/react-router";
import { Bell, MoveUpRight, Settings, X } from "lucide-react";
import { type RefObject } from "react";
import { motion } from "framer-motion";
import { notificationsAPI } from "../../../services/http-api";
import authAxios from "../../../services/authAxios";
import type { notificationType } from "../../../types/notiTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NotiMenuProps {
  showNotiMenu: boolean;
  setShowNotiMenu: (value: boolean) => void;
  notiMenuRef: RefObject<HTMLDivElement | null>;
  toggleNotiMenu: () => void;
}

const NotiMenu = ({
  showNotiMenu,
  setShowNotiMenu,
  notiMenuRef,
  toggleNotiMenu,
}: NotiMenuProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${notificationsAPI.url}/all-notifications/unread-count`
      );
      return res.data.unreadCount as number;
    },
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", "list"],
    queryFn: async (): Promise<notificationType[]> => {
      const res = await authAxios.get(
        `${notificationsAPI.url}/all-notifications/me`
      );
      return res.data.notifications;
    },
    enabled: showNotiMenu,
    staleTime: 1000 * 60 * 5,
  });

  const markAllReadMutation = useMutation({
    mutationFn: () =>
      authAxios.post(`${notificationsAPI.url}/notifications/read`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      queryClient.setQueryData(["notifications", "unread-count"], 0);
      queryClient.setQueryData(
        ["notifications", "list"],
        (old: notificationType[] = []) => old.map((n) => ({ ...n, read: true }))
      );
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onError: (err) => {
      toast.error(`Failed to mark as read: ${err}`);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) =>
      authAxios.delete(`${notificationsAPI.url}/all-notifications/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      queryClient.setQueryData(
        ["notifications", "list"],
        (old: notificationType[] = []) => old.filter((n) => n.id !== id)
      );

      const noti = notifications.find((n) => n.id === id);
      if (noti && !noti.read) {
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          (old: number = 0) => Math.max(0, old - 1)
        );
      }
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
    onError: () => {
      toast.error("Failed to delete");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <div className="relative" ref={notiMenuRef}>
      <button
        onClick={toggleNotiMenu}
        className="relative py-2 rounded-full hover:bg-white/10 transition-colors duration-200"
        title="Notifications"
      >
        <Bell className="w-7 h-7 text-white cursor-pointer" />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ${showNotiMenu ? null : "animate-pulse"}`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showNotiMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute right-0 top-full mt-3 w-96 bg-[#181C1F] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
              <button
                onClick={() => {
                  setShowNotiMenu(false);
                  navigate({ to: "/settings/notifications" });
                }}
                className="p-1 hover:bg-gray-800 rounded transition"
              >
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {isLoading
                ? "Loading..."
                : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
              {unreadCount > 0 && (
                <span className="ml-2 text-red-400 font-medium">
                  ({unreadCount} unread)
                </span>
              )}
            </p>
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-pulse text-gray-500">
                  Loading notifications...
                </div>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-400">
                Failed to load
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>You're all caught up!</p>
              </div>
            ) : (
              <ul>
                {notifications.slice(0, 10).map((noti) => (
                  <li
                    key={noti.id}
                    className="group relative py-4 px-4 -mx-4 hover:bg-gray-800/70 transition-colors border-b border-gray-800 last:border-0 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gray-800/70 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="relative flex items-start gap-3">
                      {!noti.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-snug ${
                            noti.read
                              ? "text-gray-400"
                              : "text-white font-medium"
                          }`}
                        >
                          {noti.message}
                        </p>
                        <time className="text-xs text-gray-500 block mt-1">
                          {new Date(noti.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </time>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotificationMutation.mutate(noti.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mr-2"
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <X
                          size={14}
                          className="text-gray-500 hover:text-red-400"
                        />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 border-t border-gray-800 flex justify-between text-sm bg-gray-900/50">
            <button
              onClick={() => {
                markAllReadMutation.mutate();
              }}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className="px-3 py-2 rounded text-gray-300 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              {markAllReadMutation.isPending ? (
                <>Marking...</>
              ) : (
                <>Mark all as read</>
              )}
            </button>

            <button
              onClick={() => {
                setShowNotiMenu(false);
                navigate({ to: "/notifications" });
              }}
              className="px-3 py-2 rounded hover:bg-gray-800 transition flex items-center gap-1 cursor-pointer  text-gray-300"
            >
              View all <MoveUpRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotiMenu;
