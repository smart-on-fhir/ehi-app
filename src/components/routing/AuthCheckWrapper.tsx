import { useLocation, Navigate } from "react-router";
import useAuthConsumer from "../../context/authContext";

type AuthCheckWrapperProps = {
  needsAdmin?: boolean;
  // This should only wrap JSX Elements in Router, not accept generic React.ReactNode elements (e.g. string)
  children: JSX.Element;
};

export default function AuthCheckWrapper({
  needsAdmin = false,
  children,
}: AuthCheckWrapperProps) {
  const location = useLocation();
  const { authUser, isAdminRoute } = useAuthConsumer();
  const baseUrl = isAdminRoute ? "/admin" : "";

  // If no auth, then always redirect to login
  if (!authUser) {
    return (
      <Navigate
        to={`${baseUrl}/login`}
        replace
        state={{ redirect: location.pathname }}
      />
    );
  }

  // If admin is needed, we're on an admin route, and the user isn't authenticated then cancel
  if (needsAdmin && isAdminRoute && authUser.username !== "admin") {
    return (
      <Navigate
        to={`${baseUrl}/forbidden`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
