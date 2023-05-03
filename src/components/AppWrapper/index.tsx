import { Link, NavLink } from "react-router-dom";
import smartLogo from "../../assets/logo.svg";

type AppWrapperProps = {
  children?: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-100">
      <div className="m text-opacity-900 mb-4 w-full bg-primary-200 text-gray-600 ">
        <div className="container mx-auto max-w-screen-md px-4">
          <header className="flex w-full items-center justify-between py-6">
            <Link to="/" className="flex items-center">
              <img
                src={smartLogo}
                alt="SMART on FHIR logo"
                className="mr-2 inline h-6"
              />
              <h1 className="inline text-center text-2xl">
                EHI Export Demonstration
              </h1>
            </Link>
            <nav className="space-x-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/admin/jobs">Admin View</NavLink>
            </nav>
          </header>
        </div>
      </div>
      <div className="container mx-auto max-w-screen-md px-4">{children}</div>
    </div>
  );
}
