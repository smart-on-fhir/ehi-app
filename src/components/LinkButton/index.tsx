import { Link, To } from "react-router-dom";

type LinkButtonProps = {
  to: To;
  children: React.ReactNode;
  className?: string;
};

export default function LinkButton({
  to,
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      tabIndex={0}
      className={`inline-block border px-2 py-1 text-center transition-all hover:bg-white hover:shadow-sm ${
        className ? className : ""
      }`}
    >
      {children}
    </Link>
  );
}
