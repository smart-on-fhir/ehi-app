import { Link, NavLink } from "react-router-dom";
import smartLogo from "../../assets/logo.svg";

export default function AppHeader() {
  return (
    <div className="m text-opacity-900 mb-4 w-full bg-primary-100 text-stone-600 ">
      <div className="container mx-auto max-w-screen-md px-4">
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
            <NavLink to="/admin/jobs">Admin View</NavLink>
          </nav>
        </header>
      </div>
    </div>
  );
}
