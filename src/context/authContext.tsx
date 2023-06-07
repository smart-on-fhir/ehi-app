import { useContext, createContext, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import useLoadingErrorSessionStorage from "../hooks/useLoadingErrorSessionStorage";

type UserRole = "admin" | "user" | null;

type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
};

interface AuthContextInterface {
  authUser: AuthUser | null;
  authLoading: boolean;
  authError: Error | null;
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

  async function login2(
    username: string,
    password: string,
    remember: boolean
  ): Promise<AuthUser> {
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
        response.headers.get("Content-Type")?.indexOf("application/json") !== -1
      ) {
        const errorJson = await response.json();
        errorMessage = errorJson.error;
      } else {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
    } else {
      return (await response.json()) as AuthUser;
    }
  }

  const {
    execute: login,
    loading: authLoading,
    error: authError,
    result: authUser,
  } = useLoadingErrorSessionStorage<[string, string, boolean], AuthUser>(
    login2,
    "authUser"
  );

  useEffect(() => {
    if (authUser && authUser.role === "admin") {
      navigate("/admin");
    } else if (authUser) {
      navigate(location.state?.redirect || "/jobs");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return {
    authUser,
    authLoading,
    authError,
    login,
    async logout() {
      await fetch("/api/logout", {
        headers: { accept: "application/json" },
        credentials: "include",
      });
      // setAuthUser(null);
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
