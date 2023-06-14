type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="max-h-[60vh] min-h-[200px] overflow-auto whitespace-pre-wrap rounded border p-4 ">
      {children}
    </pre>
  );
}
