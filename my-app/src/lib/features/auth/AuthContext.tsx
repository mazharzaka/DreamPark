"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setCredentials, clearCredentials, UserProfile } from "./authSlice";
import { authApi } from "./authApi";

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [logoutServer] = authApi.useLogoutServerMutation();

  const login = (token: string, user: UserProfile) => {
    dispatch(setCredentials({ token, user }));
  };

  const logout = async () => {
    try {
      await logoutServer().unwrap();
    } catch {
      console.warn(
        "Logout server request failed, clearing local credentials anyway",
      );
    } finally {
      dispatch(clearCredentials());
    }
  };

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(
        (process.env.NEXT_PUBLIC_BACKEND_URL
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/api`
          : "https://ms5k0c9j-5000.uks1.devtunnels.ms/api") + "/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.token) {
          const fetchedUser = result.data?.user;
          if (fetchedUser) {
            dispatch(
              setCredentials({ token: result.token, user: fetchedUser }),
            );
            return true;
          }
        }
      }
    } catch (err) {
      console.error("Silent refresh network error:", err);
    }
    return false;
  }, [dispatch]);

  // 1) Session Restoration on load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const success = await refreshSession();
      if (!success) {
        dispatch(clearCredentials());
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [dispatch, refreshSession]);

  // 2) Silent Refresh interval (Every 14 minutes = 840000ms)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        console.log(
          "[AuthContext] Triggering background silent token refresh...",
        );
        const success = await refreshSession();
        if (!success) {
          console.warn(
            "[AuthContext] Background refresh failed, logging out...",
          );
          dispatch(clearCredentials());
        }
      },
      14 * 60 * 1000,
    ); // 14 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, dispatch, refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
