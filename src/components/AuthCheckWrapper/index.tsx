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
  const { authUser, isAdmin } = useAuthConsumer();

  if (!authUser) {
    return (
      <Navigate to="/login" replace state={{ redirect: location.pathname }} />
    );
  }

  if (needsAdmin && !isAdmin(authUser)) {
    return (
      <Navigate to="/forbidden" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
