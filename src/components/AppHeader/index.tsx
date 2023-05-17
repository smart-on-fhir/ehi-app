import { Link, NavLink, useLocation } from "react-router-dom";
import smartLogo from "../../assets/logo.svg";
import { Shield } from "react-feather";

export default function AppHeader() {
  const location = useLocation();
  const isAdmin = location.pathname.indexOf("admin") !== -1;
  return (
    <header className="flex w-full flex-wrap items-center justify-between py-6">
      <Link to="/" className="flex items-center">
        <img
          src={smartLogo}
          alt="SMART on FHIR logo"
          className="mr-2 inline-block h-6"
        />
        <h1 className="text-center text-2xl ">EHI Export</h1>
      </Link>
      <nav className="mt-2 flex basis-full space-x-4 sm:mt-0 sm:basis-auto">
        <NavLink
          className={({ isActive }) => (isActive ? "font-bold" : "")}
          to="/"
        >
          About
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "font-bold" : "")}
          to="/jobs"
        >
          Exports
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin/jobs"
            className={({ isActive }) => (isActive ? "flex font-bold" : "flex")}
          >
            Admin
            <Shield
              aria-hidden
              className="ml-1 inline fill-active text-active"
              name="admin"
            />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
