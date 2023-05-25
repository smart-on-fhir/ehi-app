import { NavLink } from "react-router-dom";
import { Shield, User } from "react-feather";
import useAuthConsumer from "../../context/authContext";

export default function AccountLoginComponent() {
  const { isAuthenticated, isAdmin, userName } = useAuthConsumer();
  if (!isAuthenticated) {
    return <NavLink to="/login">Login</NavLink>;
  } else if (isAuthenticated && isAdmin) {
    return (
      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
      >
        Admin
        <Shield
          aria-hidden
          className="ml-1 inline stroke-2 text-active"
          name="admin"
        />
      </NavLink>
    );
  } else {
    return (
      <NavLink
        to="/account"
        className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
      >
        {userName}
        <User
          aria-hidden
          className="ml-1 inline stroke-2 text-active"
          name="admin"
        />
      </NavLink>
    );
  }
}
