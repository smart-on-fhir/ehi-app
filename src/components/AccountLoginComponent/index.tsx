import { NavLink } from "react-router-dom";
import { Shield, User } from "react-feather";
import useAuthConsumer from "../../context/authContext";

export default function AccountLoginComponent() {
  const { authUser, isAdmin, getUsername } = useAuthConsumer();
  if (!authUser) {
    return <NavLink to="/login">Login</NavLink>;
  } else if (authUser && isAdmin(authUser)) {
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
        {getUsername(authUser)}
        <User
          aria-hidden
          className="ml-1 inline stroke-2 text-active"
          name="admin"
        />
      </NavLink>
    );
  }
}
