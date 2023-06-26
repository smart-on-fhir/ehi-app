import { useState, useContext, createContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import useSessionStorage from "../hooks/useSessionStorage";

export interface AuthContextInterface {
  authUser: EHIApp.AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  login: (
    username: string,
    password: string,
    remember: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = createContext<AuthContextInterface>(null!);

/**
 * Create a payload for logging to the ehi-app's backend
 * @param username
 * @param password
 * @param remember should the account credentials persist for a long time?
 * @returns
 */
function buildLoginPayload(
  username: string,
  password: string,
  remember: boolean
) {
  const payload = new URLSearchParams();
  payload.set("username", username);
  payload.set("password", password);
  if (remember) {
    payload.set("remember", String(remember));
  }
  return payload;
}

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useSessionStorage<EHIApp.AuthUser | null>(
    "user",
    null
  );
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  return {
    authUser,
    authLoading,
    authError,
    async login(
      username: string,
      password: string,
      remember: boolean
    ): Promise<void> {
      setAuthLoading(true);
      setAuthError(null);
      const payload = buildLoginPayload(username, password, remember);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { accept: "application/json" },
        body: payload,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "";
        if (
          response.headers.get("Content-Type") &&
          response.headers.get("Content-Type")?.indexOf("application/json") !==
            -1
        ) {
          const errorJson = await response.json();
          errorMessage = errorJson.error;
        } else {
          errorMessage = await response.text();
        }
        setAuthError(errorMessage);
        setAuthLoading(false);
      } else {
        const user = await response.json();
        setAuthLoading(false);
        setAuthUser(user);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(location.state?.redirect || "/jobs");
        }
      }
    },
    async logout() {
      setAuthLoading(true);
      const response = await fetch("/api/logout", {
        headers: { accept: "application/json" },
        credentials: "include",
      });
      // Always log out and
      setAuthLoading(false);
      setAuthUser(null);
      if (!response.ok) {
        let errorMessage = "";
        if (
          response.headers.get("Content-Type") &&
          response.headers.get("Content-Type")?.indexOf("application/json") !==
            -1
        ) {
          const errorJson = await response.json();
          errorMessage = errorJson.error;
        } else {
          errorMessage = await response.text();
        }
        console.error(errorMessage);
      }
      navigate("/");
    },
  };
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function useAuthConsumer() {
  return useContext(authContext);
}
