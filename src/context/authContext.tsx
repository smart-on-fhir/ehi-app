import * as React from "react";
import { useLocation, useNavigate } from "react-router";
// import { request } from "../lib/fetchHelpers";
import useSessionStorage from "../hooks/useSesisonStorage";

interface AuthContextInterface {
  isAuthenticated: boolean;
  userType: "admin" | "user" | "guest" | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = React.createContext<AuthContextInterface>(null!);

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useSessionStorage<boolean>(
    "isAuthenticated",
    false
  );
  const [userType, setUserType] = useSessionStorage<
    AuthContextInterface["userType"]
  >("userType", null);

  return {
    isAuthenticated,
    userType,
    async login(username: string, password: string): Promise<void> {
      // const response = await request<string>("/login", {
      //   method: "post",
      //   body: JSON.stringify({
      //     username,
      //     password,
      //   }),
      // })
      setIsAuthenticated(true);
      setUserType("user");
      navigate(location.state?.redirect || "/");
    },
    logout() {
      return new Promise<void>((res) => {
        setIsAuthenticated(false);
        setUserType(null);
        navigate("/");
      });
    },
  };
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function useAuthConsumer() {
  return React.useContext(authContext);
}
