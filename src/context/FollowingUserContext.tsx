import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import authAxios from "../services/authAxios";
import type { UserFollowType } from "../types/userFollowTypes";
import { userFollowingAPI } from "../services/http-api";

interface FollowingUsersContextType {
  isFollowed: (userId: number) => boolean;
  myFollowingUsers: UserFollowType[];
  myFollowingLoading: boolean;
  myFollowingRefetch: () => void;
  myFollowers: UserFollowType[];
  myFollowersLoading: boolean;
  myFollowersRefetch: () => void;
}

const FollowingUserContext = createContext<
  FollowingUsersContextType | undefined
>(undefined);

export const FollowingUsersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: myFollowingUsers = [],
    isLoading: myFollowingLoading,
    refetch: myFollowingRefetch,
  } = useQuery<UserFollowType[]>({
    queryKey: ["my-followings"],
    queryFn: async () => {
      const res = await authAxios.get(`${userFollowingAPI.url}/following/me`);
      return res.data.following;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isFollowed = (userId: number) => {
    return myFollowingUsers.some((f) => f.following_user_id === userId);
  };

  const {
    data: myFollowers = [],
    isLoading: myFollowersLoading,
    refetch: myFollowersRefetch,
  } = useQuery<UserFollowType[]>({
    queryKey: ["my-followers"],
    queryFn: async () => {
      const res = await authAxios.get(`${userFollowingAPI.url}/followers/me`);
      return res.data.followers;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <FollowingUserContext.Provider
      value={{
        myFollowingUsers,
        isFollowed,
        myFollowingLoading,
        myFollowingRefetch,
        myFollowers,
        myFollowersLoading,
        myFollowersRefetch,
      }}
    >
      {children}
    </FollowingUserContext.Provider>
  );
};

export const useFollowingUsers = () => {
  const context = useContext(FollowingUserContext);
  if (!context) {
    throw new Error(
      "useFollowingUsers must be used within FollowingUsersProvider"
    );
  }
  return context;
};
