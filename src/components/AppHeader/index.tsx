import { Link, NavLink } from "react-router-dom";
import smartLogo from "../../assets/logo.svg";
import AccountLoginComponent from "../AccountLoginComponent";
import ExportsNavLink from "../ExportsNavLink";

export default function AppHeader() {
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
        <ExportsNavLink />
        <AccountLoginComponent />
      </nav>
    </header>
  );
}
