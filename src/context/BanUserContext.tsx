import React, { createContext, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { adminAPI } from "../services/http-api";
import { toast } from "sonner";

interface UserBanContextType {
  banUser: (
    userId: number,
    durationHours: number,
    ban_type: string,
    reason?: string,
  ) => void;
  unbanUser: (userId: number) => void;
  isBanning: boolean;
  isUnbanning: boolean;
}

const UserBanContext = createContext<UserBanContextType | undefined>(undefined);

export const UserBanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  // Ban Mutation
  const banMutation = useMutation({
    mutationFn: async ({
      userId,
      durationHours,
      reason,
      ban_type,
    }: {
      userId: number;
      durationHours: number;
      ban_type?: string;
      reason?: string;
    }) => {
      await authAxios.post(`${adminAPI.url}/users/user/${userId}/ban`, {
        ban_type: ban_type,
        duration_hours: durationHours,
        reason: reason || "Banned by admin",
      });
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["ban-status", userId] });
      toast.success("User has been banned successfully");
    },
    onError: () => toast.error("Failed to ban user"),
  });

  // Unban Mutation
  const unbanMutation = useMutation({
    mutationFn: async (userId: number) => {
      await authAxios.delete(`${adminAPI.url}/users/user/${userId}/unban`);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["ban-status", userId] });
      toast.success("User has been unbanned");
    },
    onError: () => toast.error("Failed to unban user"),
  });

  const value: UserBanContextType = {
    banUser: (userId, durationHours, ban_type, reason) =>
      banMutation.mutate({ userId, durationHours, ban_type, reason }),
    unbanUser: (userId) => unbanMutation.mutate(userId),
    isBanning: banMutation.isPending,
    isUnbanning: unbanMutation.isPending,
  };

  return (
    <UserBanContext.Provider value={value}>{children}</UserBanContext.Provider>
  );
};

export const useUserBan = () => {
  const context = useContext(UserBanContext);
  if (!context) {
    throw new Error("useUserBan must be used within UserBanProvider");
  }
  return context;
};
