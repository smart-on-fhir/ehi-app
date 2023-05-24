import { useLocation, Navigate } from "react-router";
import useAuthConsumer from "../../context/authContext";

type AuthCheckWrapperProps = {
  // This should only wrap JSX Elements in Router, not accept generic React.ReactNode elements (e.g. string)
  children: JSX.Element;
};

export default function AuthCheckWrapper({ children }: AuthCheckWrapperProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthConsumer();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ redirect: location.pathname }} />
    );
  }

  return children;
}
