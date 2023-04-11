import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSMARTContext } from "../../context/smartContext";
import "./App.css";
import CodeBlock from "../../components/CodeBlock";
import Button from "../../components/Button";

export default function App() {
  const SMART = useSMARTContext();
  const navigate = useNavigate();
  const { completeAuthorization } = SMART;

  useEffect(() => {
    // On PageLoad, try to authorize
    completeAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <p>Placeholder for list of jobs</p>
      <Button
        onClick={() => navigate("/institutionSelection")}
        display="Add Record"
      />
      <h1>Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock>
    </>
  );
}
