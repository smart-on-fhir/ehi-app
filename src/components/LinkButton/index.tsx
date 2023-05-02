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
      className={`inline-block border bg-primary-50 px-2 py-1 text-center transition-all hover:bg-primary-200 hover:shadow-sm ${
        className ? className : ""
      }`}
    >
      {children}
    </Link>
  );
}
