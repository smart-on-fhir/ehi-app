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
      <h1>{display}</h1>
      <CodeBlock>{String(error)}</CodeBlock>
    </>
  );
}
