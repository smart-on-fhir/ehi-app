import { useState, useContext, createContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import useSessionStorage from "../hooks/useSessionStorage";

type UserRole = "admin" | "user" | null;

type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};

interface AuthContextInterface {
  authUser: AuthUser | null;
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

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useSessionStorage<AuthUser | null>(
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
      const payload = new URLSearchParams();
      payload.set("username", username);
      payload.set("password", password);
      if (remember) {
        payload.set("remember", String(remember));
      }

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
      await fetch("/api/logout", {
        headers: { accept: "application/json" },
        credentials: "include",
      });
      setAuthUser(null);
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
