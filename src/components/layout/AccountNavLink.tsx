import { NavLink } from "react-router-dom";
import { Shield, User } from "react-feather";
import useAuthConsumer from "../../context/authContext";

export default function AccountNavLink() {
  const { authUser } = useAuthConsumer();
  if (!authUser) {
    return (
      <NavLink
        to="/login"
        className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
      >
        Login
      </NavLink>
    );
  } else if (authUser && authUser.role === "admin") {
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
        {authUser.username}
        <User
          aria-hidden
          className="ml-1 inline stroke-2 text-active"
          name="admin"
        />
      </NavLink>
    );
  }
}
