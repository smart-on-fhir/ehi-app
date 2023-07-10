import { NavLink } from "react-router-dom";
import useAuthConsumer from "../../context/authContext";

export default function ExportsNavLink() {
  const { authUser, isAdminRoute } = useAuthConsumer();
  const baseUrl = isAdminRoute ? "/admin" : "";
  if (!authUser) {
    return null;
  } else {
    return (
      <NavLink
        to={`${baseUrl}/jobs`}
        className={({ isActive }) => (isActive ? "font-bold" : "")}
      >
        Exports
      </NavLink>
    );
  }
}
