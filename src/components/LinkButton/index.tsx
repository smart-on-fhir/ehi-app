import { Link, To } from "react-router-dom";

type LinkButtonProps = {
  to: To;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "emphasized";
};

export default function LinkButton({
  to,
  children,
  className,
  variant = "primary",
}: LinkButtonProps) {
  let buttonStyles =
    "cursor-pointer border text-center px-2 py-1 transition-all hover:shadow-lg";
  switch (variant) {
    case "emphasized":
      buttonStyles += " bg-active text-white hover:bg-active-dark";
      break;
    case "primary":
      buttonStyles += " bg-primary-50 hover:bg-primary-100";
      break;
  }
  return (
    <Link to={to} className={`${buttonStyles} ${className ? className : ""}`}>
      {children}
    </Link>
  );
}
