type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return <pre className="overflow-auto rounded border p-4 ">{children}</pre>;
}
