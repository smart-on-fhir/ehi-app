import { NavLink } from "react-router-dom";
import useAuthConsumer from "../../context/authContext";

export default function ExportsNavLink() {
  const { authUser, isAdmin } = useAuthConsumer();
  if (!authUser) {
    return null;
  } else if (authUser && isAdmin(authUser)) {
    return (
      <NavLink
        className={({ isActive }) => (isActive ? "font-bold" : "")}
        to="/admin/jobs"
      >
        Exports
      </NavLink>
    );
  } else {
    return (
      <NavLink
        className={({ isActive }) => (isActive ? "font-bold" : "")}
        to="/jobs"
      >
        Exports
      </NavLink>
    );
  }
}
