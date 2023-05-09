import { Link, NavLink } from "react-router-dom";
import smartLogo from "../../assets/logo.svg";

export default function AppHeader() {
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
      <nav className="mt-2 basis-full space-x-2 sm:mt-0 sm:basis-auto">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Exports</NavLink>
        <NavLink to="/admin/jobs">Admin View</NavLink>
      </nav>
    </header>
  );
}
