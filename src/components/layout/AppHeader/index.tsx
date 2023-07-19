import { Link, NavLink } from "react-router-dom";
import smartLogo from "./smart-logo.svg";
import smartLogoTall from "./tall-smart-logo.svg";
import AccountNavLink from "../AccountNavLink";
import ExportsNavLink from "../ExportsNavLink";
import useAuthConsumer from "../../../context/authContext";

export default function AppHeader() {
  const { isAdminRoute } = useAuthConsumer();
  const baseUrl = isAdminRoute ? "/admin" : "";
  return (
    <header className="flex w-full flex-wrap items-center justify-between py-6">
      <Link to={`${baseUrl}/`} className="flex items-center">
        <img
          src={smartLogo}
          alt="SMART on FHIR logo"
          className="mr-2 hidden h-[36px] sm:inline-block"
        />
        <img
          src={smartLogoTall}
          alt="SMART on FHIR logo"
          className="mr-2 inline-block h-[70px] sm:hidden"
        />
        {isAdminRoute ? (
          <h1 className="text-2xl ">EHI Export Review App</h1>
        ) : (
          <h1 className="text-2xl ">Second Opinion App</h1>
        )}
      </Link>
      <nav className="mt-4 flex basis-full space-x-4 sm:mt-0 sm:basis-auto">
        <NavLink
          className={({ isActive }) => (isActive ? "font-bold" : "")}
          to={`${baseUrl}/`}
        >
          About
        </NavLink>
        <ExportsNavLink />
        <AccountNavLink />
      </nav>
    </header>
  );
}
