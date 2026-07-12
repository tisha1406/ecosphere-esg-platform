import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../shared/types/api.types";
import { setAccessTokenInMemory, apiClient } from "../../shared/lib/api-client";

// Access token expires in 15 min — refresh 3 min before that.
const SILENT_REFRESH_INTERVAL_MS = 12 * 60 * 1000; // 12 minutes

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const silentRefreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ------------------------------------------------------------------
  // Internal helpers
  // ------------------------------------------------------------------

  /** Fetch the /me profile once we have a valid access token. */
  const fetchProfile = useCallback(async (token: string) => {
    try {
      setAccessTokenInMemory(token);
      setAccessToken(token);
      const profile = await apiClient.get<any, User>("/api/v1/auth/me");
      setUser(profile);
    } catch {
      setAccessTokenInMemory(null);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  /** Clear local auth state — does NOT call the server. */
  const clearAuth = useCallback(() => {
    setAccessTokenInMemory(null);
    setAccessToken(null);
    setUser(null);
    if (silentRefreshTimer.current) {
      clearInterval(silentRefreshTimer.current);
      silentRefreshTimer.current = null;
    }
  }, []);

  // ------------------------------------------------------------------
  // refreshSession — called on app boot and by the periodic timer
  // ------------------------------------------------------------------
  const refreshSession = useCallback(async (): Promise<string | null> => {
    try {
      const response = await apiClient.post<any, { access_token: string }>(
        "/api/v1/auth/refresh"
      );
      const token = response.access_token;
      await fetchProfile(token);
      return token;
    } catch {
      clearAuth();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, clearAuth]);

  // ------------------------------------------------------------------
  // Start / restart the periodic silent-refresh timer
  // ------------------------------------------------------------------
  const startSilentRefresh = useCallback(() => {
    if (silentRefreshTimer.current) clearInterval(silentRefreshTimer.current);
    silentRefreshTimer.current = setInterval(async () => {
      const token = await refreshSession();
      // If refresh fails the timer is cleared inside clearAuth()
      if (!token) {
        window.dispatchEvent(new Event("auth-expired"));
      }
    }, SILENT_REFRESH_INTERVAL_MS);
  }, [refreshSession]);

  // ------------------------------------------------------------------
  // login — call after a successful /login to set up state + timer
  // ------------------------------------------------------------------
  const login = useCallback(
    async (token: string) => {
      setIsLoading(true);
      await fetchProfile(token);
      setIsLoading(false);
      startSilentRefresh();
    },
    [fetchProfile, startSilentRefresh]
  );

  // ------------------------------------------------------------------
  // logout — invalidates server-side refresh token, clears state
  // ------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } catch {
      // Best-effort — clear locally even if server call fails
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  // ------------------------------------------------------------------
  // Boot — attempt silent refresh once on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    const boot = async () => {
      const token = await refreshSession();
      if (token) startSilentRefresh();
    };
    boot();

    const handleAuthExpired = () => clearAuth();
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
      if (silentRefreshTimer.current) clearInterval(silentRefreshTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
