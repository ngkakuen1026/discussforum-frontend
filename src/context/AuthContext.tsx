import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { usersAPI, authAPI } from "../services/http-api";
import authAxios from "../services/authAxios";
import type { UserType } from "../types/userTypes";

type AuthContextType = {
  isLoggedIn: boolean;
  user: UserType | null;
  checkAuth: () => Promise<void>;
  logout: () => void;
  setUser: (user: UserType | null) => void; 
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  checkAuth: async () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  const checkAuth = async () => {
    try {
      const res = await authAxios.get(`${usersAPI.url}/profile/me`, {
        withCredentials: true,
      });
      setIsLoggedIn(true);
      setUser(res.data.user);
      console.log("Logged in user:", res.data.user);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null); 
      console.error("Not logged in", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${authAPI.url}/logout`, null, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUser(null); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, checkAuth, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
