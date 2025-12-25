import { createContext, useContext, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { userBlockedAPI } from "../services/http-api";
import type { UserBlockedType } from "../types/userBlcokedTypes";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useState } from "react";

interface BlockedUsersContextType {
  blockedUsers: UserBlockedType[];
  isBlocked: (userId: number) => boolean;
  isLoading: boolean;
  isPending: boolean;
  refetch: () => void;
  toggleBlockedUsers: (userId: number) => void;
}

const BlockedUsersContext = createContext<BlockedUsersContextType | undefined>(
  undefined
);

export const BlockedUsersProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [blockReason] = useState<string>("");

  const {
    data: blockedUsers = [],
    isLoading,
    refetch,
  } = useQuery<UserBlockedType[]>({
    queryKey: ["my-blockeds"],
    queryFn: async () => {
      const res = await authAxios.get(`${userBlockedAPI.url}/blocked/me`);
      return res.data.blockedUserList;
    },
    staleTime: 5 * 60 * 1000,
  });

  const blockMutation = useMutation({
    mutationFn: (userId: number) =>
      authAxios.post(`${userBlockedAPI.url}/block/${userId}`, {
        block_reason: blockReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blockeds"] });
      toast.success("User blocked!");
    },
    onError: (error) => {
      toast.error("Failed to block user.");
      if (isAxiosError(error)) {
        console.error(`User follow error: ${error}`);
      }
    },
  });

  const unBlockMutation = useMutation({
    mutationFn: (userId: number) =>
      authAxios.delete(`${userBlockedAPI.url}/unblock/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-blockeds"] });
      toast.success("User unblocked!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        console.error(`User follow error: ${error}`);
      }
    },
  });

  const toggleBlockedUsers = (userId: number) => {
    if (blockedUsers.some((b) => b.blocked_user_id === userId)) {
      unBlockMutation.mutate(userId);
    } else {
      blockMutation.mutate(userId);
    }
  };

  const isBlocked = (userId: number) => {
    return blockedUsers.some((b) => b.blocked_user_id === userId);
  };

  const isPending = blockMutation.isPending || unBlockMutation.isPending;

  return (
    <BlockedUsersContext.Provider
      value={{
        blockedUsers,
        isBlocked,
        isLoading,
        isPending,
        refetch,
        toggleBlockedUsers,
      }}
    >
      {children}
    </BlockedUsersContext.Provider>
  );
};

export const useBlockedUsers = () => {
  const context = useContext(BlockedUsersContext);
  if (!context) {
    throw new Error("useBlockedUsers must be used within BlockedUsersProvider");
  }
  return context;
};
