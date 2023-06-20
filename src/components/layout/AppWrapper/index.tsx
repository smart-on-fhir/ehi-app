import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import { ReactComponent as Wave } from "./wave.svg";
import useAuthConsumer from "../../../context/authContext";

type AppWrapperProps = {
  children?: React.ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  const { authUser } = useAuthConsumer();

  return (
    <div className="flex min-h-screen min-w-[100vw] flex-col bg-neutral-100 accent-active">
      <div className="text-opacity-900 w-full bg-primary-100 text-stone-600 ">
        <div className="container mx-auto max-w-screen-lg px-4">
          <AppHeader />
        </div>
      </div>
      {authUser?.role === "admin" && (
        <div className="w-full bg-[#900] py-2 text-center text-xl font-bold text-white">
          Admin Mode
        </div>
      )}
      <div className="container mx-auto max-w-screen-lg flex-1 flex-shrink-0 px-4 py-8">
        {children}
      </div>
      <div className="relative mt-8 w-full bg-active py-4 pb-8 text-white">
        <div
          id="wave-container"
          className="absolute -top-8 -mx-[calc(-50vw--50%)] h-8 w-full"
        >
          <Wave title="Decorative wave" preserveAspectRatio="none" />
        </div>
        <div className="container mx-auto max-w-screen-lg px-4">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
