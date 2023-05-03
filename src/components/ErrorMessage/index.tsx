import { AlertTriangle } from "react-feather";
import CodeBlock from "../../components/CodeBlock";
import HeadingOne from "../HeadingOne";

export default function ErrorMessage({
  error,
  display,
}: {
  error: Error | null;
  display: string;
}) {
  return (
    <>
      <HeadingOne>
        <div className="flex items-baseline">
          <AlertTriangle className="mr-2 inline " />
          Error Occurred
        </div>
      </HeadingOne>
      <p className="mb-2">{display}.</p>
      <CodeBlock>{error?.message}</CodeBlock>
    </>
  );
}
