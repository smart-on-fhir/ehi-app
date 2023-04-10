import { NavLink } from "react-router-dom";

type AppWrapperProps = {
  children?: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-100">
      <div className="container mx-auto">
        <div className="flex w-full items-center justify-between">
          <h1 className="my-4 text-center text-xl">Second Opinion App</h1>
          <nav className="space-x-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/admin/jobs">Admin View</NavLink>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
