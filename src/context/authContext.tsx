import * as React from "react";
import { useLocation, useNavigate } from "react-router";
// import { request } from "../lib/fetchHelpers";
import useSessionStorage from "../hooks/useSesisonStorage";

type UserType = "admin" | "user" | null;
interface AuthContextInterface {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userName: string;
  userType: UserType;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const authContext = React.createContext<AuthContextInterface>(null!);

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useSessionStorage<string>("userName", "");
  const [isAuthenticated, setIsAuthenticated] = useSessionStorage<boolean>(
    "isAuthenticated",
    false
  );
  const [userType, setUserType] = useSessionStorage<UserType>("userType", null);
  const isAdmin = userType === "admin";
  return {
    isAuthenticated,
    isAdmin,
    userName,
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
      if (username === "admin") {
        setUserName("Admin Dylan");
        setUserType("admin");
        // Admins should always redirect to the admin panel
        navigate("/admin");
      } else if (username === "error") {
        throw new Error("Could not authenticate with the provided credentials");
      } else {
        setUserName("Dylan Phelan");
        setUserType("user");
        navigate(location.state?.redirect || "/jobs");
      }
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
