type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="min-h-[200px] whitespace-pre-wrap rounded border p-4 ">
      {children}
    </pre>
  );
}
