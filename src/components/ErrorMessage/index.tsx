import { AlertTriangle } from "react-feather";
import CodeBlock from "../../components/CodeBlock";

export default function ErrorMessage({
  error,
  display,
}: {
  error: Error | null;
  display: string;
}) {
  return (
    <>
      <p className="mb-2  flex items-center text-xl font-bold">
        <AlertTriangle className="mr-2 inline " />
        {display}
      </p>
      <CodeBlock>{error?.message}</CodeBlock>
    </>
  );
}
