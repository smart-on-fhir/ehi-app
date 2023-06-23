import { AlertTriangle } from "react-feather";
import CodeBlock from "../CodeBlock";

interface ErrorMessageProps {
  /**
   * A title to visualize along with the Error details
   */
  display: string;
  /**
   * The error object to visualize
   */
  error: Error | null;
}

export default function ErrorMessage({ error, display }: ErrorMessageProps) {
  return (
    <>
      <p className="mb-2 flex items-center text-xl font-bold">
        <AlertTriangle className="mr-2 inline min-w-[2rem] " />
        {display}
      </p>
      <CodeBlock>{error?.message}</CodeBlock>
    </>
  );
}
