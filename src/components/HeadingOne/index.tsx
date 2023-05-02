export default function HeadingOne({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <h1 className="mb-6 w-fit border-b-2 py-2 pr-4 text-3xl font-semibold">
      {children}
    </h1>
  );
}
