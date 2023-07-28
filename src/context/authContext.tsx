import { useState, useContext, createContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import useSessionStorage from "../hooks/useSessionStorage";
import { isAdminRoute as isAdminRouteFn } from "../lib";

export interface AuthContextInterface {
  authUser: EHIApp.AuthUser | null;
  authLoading: boolean;
  authError: string | null;
  isAdminRoute: boolean;
  navigateToLogin: () => void;
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  localLogout: () => void;
  logout: () => Promise<void>;
}

const authContext = createContext<AuthContextInterface>(null!);

/**
 * Create a payload for logging to the ehi-app's backend
 * @param username
 * @param password
 * @param remember optional
 * @returns
 */
function buildLoginPayload(
  username: string,
  password: string,
  remember?: boolean
) {
  const payload = new URLSearchParams();
  payload.set("username", username);
  payload.set("password", password);
  if (remember) {
    payload.set("remember", String(remember));
  }
  return payload;
}

/**
 * Takes a Response object from a login/logout call and parses off an error
 * message if there is one
 * @param response
 * @returns a text representation of the auth error, or undefined if the response is not an error
 */
export async function formatAuthResponseError(response: Response) {
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
    return errorMessage;
  }
}

function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  // Track if we are displaying the admin version of pages or not
  const isAdminRoute = isAdminRouteFn(location);
  const [authUser, setAuthUser] = useSessionStorage<EHIApp.AuthUser | null>(
    isAdminRoute ? "admin" : "user",
    null
  );
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  return {
    authUser,
    authLoading,
    authError,
    isAdminRoute,
    /**
     * Navigate to the relevant login page based on if we're in admin or patient mode
     */
    navigateToLogin() {
      isAdminRoute ? navigate("/admin/login") : navigate("/login");
    },
    /**
     * Makes a login request and updates loading/authUser/error based on responses
     *
     */
    async login(
      username: string,
      password: string,
      remember?: boolean
    ): Promise<void> {
      setAuthLoading(true);
      setAuthError(null);
      const payload = buildLoginPayload(username, password, remember);

      const loginEndpoint = isAdminRoute
        ? `${process.env.REACT_APP_EHI_SERVER}/admin/login`
        : "/api/login";
      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: { accept: "application/json" },
        body: payload,
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await formatAuthResponseError(response);
        // We know there will be an error since we've checked !response.ok
        setAuthError(errorMessage!);
        setAuthLoading(false);
      } else {
        const user = await response.json();
        setAuthLoading(false);
        setAuthUser(user);
        // After login, redirect to jobs by default and a redirect if supplied
        if (isAdminRoute) {
          navigate("/admin/jobs");
        } else {
          navigate(location.state?.redirect || "/jobs");
        }
      }
    },
    /**
     * Public fn for removing auth information from local state
     * Useful for clearing cached login information after a session cookie expires
     */
    localLogout() {
      setAuthUser(null);
    },
    /**
     * Makes a logout request and updates loading/authUser state, logging any errors it sees
     * Note: Always remove local authUser state, regardless of the network response
     */
    async logout() {
      setAuthLoading(true);
      const logoutEndpoint = isAdminRoute
        ? `${process.env.REACT_APP_EHI_SERVER}/admin/logout`
        : "/api/logout";
      const response = await fetch(logoutEndpoint, {
        headers: { accept: "application/json" },
        credentials: "include",
      });
      // Always log out locally, regardless of network response
      setAuthLoading(false);
      setAuthUser(null);
      if (!response.ok) {
        const errorMessage = await formatAuthResponseError(response);
        // We know there will be an error since we've checked !response.ok
        console.error(errorMessage);
      }
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
