import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { usersAPI } from "../services/http-api";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export interface NotificationPreferences {
  follow_notifications: boolean;
  unfollow_notifications: boolean;
  post_notifications: boolean;
  comment_notifications: boolean;
  comment_reply_notifications: boolean;
  like_notifications: boolean;
  dislike_notifications: boolean;
  mention_notifications: boolean;

  admin_profile_edit_notifications: boolean;
  admin_avatar_update_notifications: boolean;
  admin_avatar_delete_notifications: boolean;
  admin_user_delete_notifications: boolean;
  admin_post_delete_notifications: boolean;
  admin_comment_delete_notifications: boolean;
  admin_report_resolved_notifications: boolean;
  admin_tag_approved_notifications: boolean;
  admin_tag_deleted_notifications: boolean;
  admin_category_new_notifications: boolean;
  admin_category_edit_notifications: boolean;
  admin_category_delete_notifications: boolean;
}

interface UserNotiPreferenceContextType {
  preferences: NotificationPreferences | undefined;
  isLoading: boolean;
  togglePreference: (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => void;
  setPreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  isToggling: boolean;
}

const UserNotiPreferenceContext = createContext<
  UserNotiPreferenceContextType | undefined
>(undefined);

export function UserNotiPreferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ["auth-user-notification-preferences"],
    queryFn: async () => {
      const res = await authAxios.get(
        `${usersAPI.url}/notification-preferences`,
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: async (
      payload:
        | Partial<NotificationPreferences>
        | { key: keyof NotificationPreferences; value: boolean },
    ) => {
      // Normalize to partial payload
      const updates =
        "key" in payload ? { [payload.key]: payload.value } : payload;
      const res = await authAxios.patch(
        `${usersAPI.url}/notification-preferences`,
        updates,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth-user-notification-preferences"],
      });
      toast.success("Notification preferences updated");
    },
    onError: (error) => {
      let message = "Failed to update preferences";
      if (isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      }
      toast.error(message);
    },
  });

  const togglePreference = useCallback(
    (key: keyof NotificationPreferences, value: boolean) => {
      updateMutation.mutate({ key, value });
    },
    [updateMutation],
  );

  const setPreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      await updateMutation.mutateAsync(updates);
    },
    [updateMutation],
  );

  const value = useMemo(
    () => ({
      preferences,
      isLoading,
      togglePreference,
      setPreferences,
      isToggling: updateMutation.isPending,
    }),
    [
      preferences,
      isLoading,
      togglePreference,
      setPreferences,
      updateMutation.isPending,
    ],
  );

  return (
    <UserNotiPreferenceContext.Provider value={value}>
      {children}
    </UserNotiPreferenceContext.Provider>
  );
}

export const useUserNotiPreference = () => {
  const context = useContext(UserNotiPreferenceContext);
  if (!context) {
    throw new Error(
      "useUserNotiPreference must be used within UserNotiPreferenceProvider",
    );
  }
  return context;
};
