type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded border p-4 ">
      {children}
    </pre>
  );
}
