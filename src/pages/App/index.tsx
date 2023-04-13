// import { useSMARTContext } from "../../context/smartContext";
// import SmartDebugger from "../../components/SmartDebugger";
import UserExportJobList from "../../components/UserExportJobList";
import "./App.css";

export default function App() {
  // const SMART = useSMARTContext();

  return (
    <>
      <UserExportJobList />
      {/* <SmartDebugger smart={SMART} /> */}
    </>
  );
}
