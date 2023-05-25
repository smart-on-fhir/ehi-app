import { NavLink } from "react-router-dom";
import useAuthConsumer from "../../context/authContext";

export default function ExportsNavLink() {
  const { isAuthenticated, isAdmin } = useAuthConsumer();
  if (!isAuthenticated) {
    return null;
  } else if (isAuthenticated && isAdmin) {
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
