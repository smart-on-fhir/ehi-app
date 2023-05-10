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
        <h1 className="inline-block text-center text-2xl sm:hidden">
          EHI Export Demo
        </h1>
        <h1 className="hidden text-center text-2xl sm:inline-block">
          EHI Export Demonstration
        </h1>
      </Link>
      <nav className="mt-2 flex basis-full space-x-4 sm:mt-0 sm:basis-auto">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Exports</NavLink>
        {isAdmin && (
          <NavLink to="/admin/jobs" className={"flex"}>
            Admin
            <Shield
              aria-hidden
              className="ml-1 inline fill-primary-active text-primary-active"
              name="admin"
            />
          </NavLink>
        )}
      </nav>
    </header>
  );
}
