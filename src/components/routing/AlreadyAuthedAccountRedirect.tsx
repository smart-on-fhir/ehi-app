import { Navigate } from "react-router";
import useAuthConsumer from "../../context/authContext";

type AlreadyAuthedAccountRedirectProps = {
  // This should only wrap JSX Elements in Router, not accept generic React.ReactNode elements (e.g. string)
  children: JSX.Element;
};

export default function AlreadyAuthedAccountRedirect({
  children,
}: AlreadyAuthedAccountRedirectProps) {
  const { authUser, isAdminRoute } = useAuthConsumer();
  if (authUser) {
    return (
      <Navigate to={isAdminRoute ? "/admin/account" : "/account"} replace />
    );
  }

  return children;
}
