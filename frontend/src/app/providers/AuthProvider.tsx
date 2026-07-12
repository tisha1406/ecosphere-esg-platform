import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "../../shared/types/api.types";
import { setAccessTokenInMemory, apiClient } from "../../shared/lib/api-client";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (token: string) => {
    try {
      setAccessTokenInMemory(token);
      setAccessToken(token);
      const profile = await apiClient.get<any, User>("/api/v1/auth/me");
      setUser(profile);
    } catch (err) {
      setAccessTokenInMemory(null);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const response = await apiClient.post<any, { access_token: string }>("/api/v1/auth/refresh");
      const token = response.access_token;
      await fetchProfile(token);
      return token;
    } catch (err) {
      setAccessTokenInMemory(null);
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = useCallback(async (token: string) => {
    setIsLoading(true);
    await fetchProfile(token);
    setIsLoading(false);
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      setAccessTokenInMemory(null);
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();

    const handleAuthExpired = () => {
      setAccessTokenInMemory(null);
      setAccessToken(null);
      setUser(null);
    };
    window.addEventListener("auth-expired", handleAuthExpired);
    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [refreshSession]);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
