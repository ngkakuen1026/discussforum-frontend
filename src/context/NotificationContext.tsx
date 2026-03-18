import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { notificationsAPI } from "../services/http-api";
import { toast } from "sonner";
import type { notificationType } from "../types/notiTypes";

interface NotificationContextType {
  notifications: notificationType[];
  unreadCount: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  isMarkingAll: boolean;
  isDeleting: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Fetch unread count (used for bell badge)
  const unreadQuery = useQuery<number>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${notificationsAPI.url}/all-notifications/unread-count`,
      );
      return res.data.unreadCount ?? 0;
    },
    staleTime: 60 * 1000,
    refetchInterval: 30 * 1000,
  });

  // Fetch full notification list (only when menu is open or needed)
  const listQuery = useQuery<notificationType[]>({
    queryKey: ["notifications", "list"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${notificationsAPI.url}/all-notifications/me`,
      );
      return res.data.notifications ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mark all as read
  const markAllMutation = useMutation({
    mutationFn: async () => {
      await authAxios.post(`${notificationsAPI.url}/notifications/read`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      queryClient.setQueryData(["notifications", "unread-count"], 0);
      queryClient.setQueryData(
        ["notifications", "list"],
        (old: notificationType[] = []) =>
          old.map((n) => ({ ...n, read: true })),
      );
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
    },
    onError: (err) => {
      console.log("Error marking all as read:", err);
      toast.error("Failed to mark all as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Delete single notification
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await authAxios.delete(`${notificationsAPI.url}/all-notifications/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      // Optimistic remove from list
      queryClient.setQueryData(
        ["notifications", "list"],
        (old: notificationType[] = []) => old.filter((n) => n.id !== id),
      );

      // Decrease unread count if it was unread
      const noti = listQuery.data?.find((n) => n.id === id);
      if (noti && !noti.read) {
        queryClient.setQueryData(
          ["notifications", "unread-count"],
          (old: number = 0) => Math.max(0, old - 1),
        );
      }
    },
    onSuccess: () => {
      toast.success("Notification deleted");
    },
    onError: () => {
      toast.error("Failed to delete notification");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const value = useMemo(
    () => ({
      notifications: listQuery.data ?? [],
      unreadCount: unreadQuery.data ?? 0,
      isLoading: listQuery.isLoading || unreadQuery.isLoading,
      isError: listQuery.isError || unreadQuery.isError,
      refetch: () => {
        listQuery.refetch();
        unreadQuery.refetch();
      },
      markAllAsRead: markAllMutation.mutateAsync,
      deleteNotification: deleteMutation.mutateAsync,
      isMarkingAll: markAllMutation.isPending,
      isDeleting: deleteMutation.isPending,
    }),
    [
      listQuery,
      unreadQuery,
      markAllMutation.mutateAsync,
      markAllMutation.isPending,
      deleteMutation.mutateAsync,
      deleteMutation.isPending,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};
