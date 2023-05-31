import * as React from "react";
import { useContext, createContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import useSessionStorage from "../hooks/useSesisonStorage";

type UserRole = "admin" | "user" | null;

type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};

interface AuthContextInterface {
  authUser: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
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

  return {
    authUser,
    async login(username: string, password: string): Promise<void> {
      const payload = new URLSearchParams();
      payload.set("username", username);
      payload.set("password", password);

      const response = await fetch("/login", {
        method: "POST",
        headers: { accept: "application/json" },
        body: payload,
        credentials: "include",
      });

      if (!response.ok) {
        setAuthUser(null);
        console.warn(await response.text());
      } else {
        const user = await response.json();
        setAuthUser(user);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(location.state?.redirect || "/jobs");
        }
      }
    },
    async logout() {
      await fetch("/logout", {
        headers: { accept: "application/json" },
        credentials: "include",
      });
      // TODO: Error handling?
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
