import { useSMARTContext } from "../../context/smartContext";
import "./App.css";
import CodeBlock from "../../components/CodeBlock";
import UserExportJobList from "../../components/UserExportJobList";

export default function App() {
  const SMART = useSMARTContext();

  return (
    <>
      <UserExportJobList />
      <h1 className="mb-2">Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock>
    </>
  );
}
