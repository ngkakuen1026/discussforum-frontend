import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import { userBlockedAPI } from "../services/http-api";
import type { UserBlockedType } from "../types/userBlcokedTypes";

interface BlockedUsersContextType {
  blockedUsers: UserBlockedType[];
  isBlocked: (userId: number) => boolean;
  isLoading: boolean;
  refetch: () => void;
}

const BlockedUsersContext = createContext<BlockedUsersContextType>({
  blockedUsers: [],
  isBlocked: () => false,
  isLoading: false,
  refetch: () => void 0,
});

export const BlockedUsersProvider = ({ children }: { children: ReactNode }) => {
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

  const isBlocked = (userId: number) => {
    return blockedUsers.some((b) => b.blocked_user_id === userId);
  };

  return (
    <BlockedUsersContext.Provider
      value={{ blockedUsers, isBlocked, isLoading, refetch }}
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
