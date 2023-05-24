import * as React from "react";
import useSessionStorage from "../hooks/useSesisonStorage";

interface AuthContextInterface {
  authed: boolean;
  token: string;
  userType: "admin" | "user" | null;
  login: Function;
  logout: Function;
}

const authContext = React.createContext<AuthContextInterface>(null!);

function useAuth() {
  const [authed, setAuthed] = useSessionStorage<boolean>("authed", false);
  const [token, setToken] = useSessionStorage<string>("token", "");
  const [userType, setUserType] = useSessionStorage<
    AuthContextInterface["userType"]
  >("userType", null);

  return {
    authed,
    token,
    userType,
    login() {
      return new Promise<void>((res) => {
        setAuthed(true);
        setToken("1678214fgdkafdsr51");
        setUserType("user");
        res();
      });
    },
    logout() {
      return new Promise<void>((res) => {
        setAuthed(false);
        setToken("");
        setUserType(null);
        res();
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

export default function AuthConsumer() {
  return React.useContext(authContext);
}
