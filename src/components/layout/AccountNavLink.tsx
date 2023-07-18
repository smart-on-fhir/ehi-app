import { NavLink } from "react-router-dom";
import { Shield, User } from "react-feather";
import useAuthConsumer from "../../context/authContext";

export default function AccountNavLink() {
  const { authUser, isAdminRoute } = useAuthConsumer();
  const baseUrl = isAdminRoute ? "/admin" : "";
  if (!authUser) {
    return (
      <NavLink
        to={`${baseUrl}/login`}
        className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
      >
        Login
      </NavLink>
    );
  } else {
    return (
      <NavLink
        to={`${baseUrl}/account`}
        className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
      >
        {authUser.username}
        {authUser && isAdminRoute ? (
          <User
            aria-hidden
            className="ml-1 inline stroke-2 text-active dark:text-gray-200"
            name="admin"
          />
        ) : (
          <Shield
            aria-hidden
            className="ml-1 inline stroke-2 text-active dark:text-gray-200"
            name="admin"
          />
        )}
      </NavLink>
    );
  }
}
