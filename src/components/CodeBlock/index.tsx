type CodeBlockProps = {
  children?: React.ReactNode;
};

export default function CodeBlock({ children }: CodeBlockProps) {
  return <pre className="mt-2 overflow-auto border pb-2 ">{children}</pre>;
}
