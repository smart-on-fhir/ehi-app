import CodeBlock from "../CodeBlock";
import { SMARTContextInterface } from "../../types";

export default function SmartDebugger({
  smart,
}: {
  smart: SMARTContextInterface;
}) {
  return (
    <>
      <h1 className="mb-2">Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(smart, null, 4)}</CodeBlock>
    </>
  );
}
