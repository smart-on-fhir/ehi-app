export default function HeadingOne({
  children,
  alignment = "left",
}: {
  children: React.ReactNode;
  alignment?: "left" | "center";
}): JSX.Element {
  let paddingStyles = "";
  switch (alignment) {
    case "left":
      paddingStyles = "pb-1 pr-4";
      break;
    case "center":
      paddingStyles = "pb-1 px-2";
  }
  return (
    <h1
      className={`mb-6 w-fit border-b-2 ${paddingStyles} text-3xl font-semibold`}
    >
      {children}
    </h1>
  );
}
