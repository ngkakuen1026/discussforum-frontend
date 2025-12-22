import { createContext, useContext, type ReactNode } from "react";
import axios from "axios";
import { usersAPI, authAPI } from "../services/http-api";
import authAxios from "../services/authAxios";
import type { UserType } from "../types/userTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserType | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await authAxios.get(`${usersAPI.url}/profile/me`);
      return res.data.user || null;
    },
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const isLoggedIn = !!user;

  const logout = async () => {
    try {
      await axios.post(`${authAPI.url}/logout`, null, {
        withCredentials: true,
      });
      queryClient.setQueryData(["auth-user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user: user || null,
        isLoading,
        isError,
        refetch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
