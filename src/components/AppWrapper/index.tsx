type AppWrapperProps = {
  children?: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-100">
      <div className="container mx-auto">
        <h1 className="my-4 text-center text-xl">Second Opinion App</h1>
        {children}
      </div>
    </div>
  );
}
