import AppHeader from "../AppHeader";

type AppWrapperProps = {
  children?: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-100">
      <AppHeader />
      <div className="container mx-auto max-w-screen-md px-4">{children}</div>
    </div>
  );
}
