type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return (
    <pre className="max-w-4xl overflow-auto border border-black pb-2 ">
      {children}
    </pre>
  );
}
