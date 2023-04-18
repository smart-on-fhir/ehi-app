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
      <h1 className="mb-2">{display}</h1>
      <CodeBlock>{error?.message}</CodeBlock>
    </>
  );
}
