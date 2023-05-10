import { Link, To } from "react-router-dom";

type LinkButtonProps = {
  to: To;
  children: React.ReactNode;
  variant?: "primary" | "emphasized";
  className?: string;
};

export default function LinkButton({
  to,
  className,
  variant = "primary",
  children,
}: LinkButtonProps) {
  let buttonStyles =
    "cursor-pointer border text-center px-2 py-1 transition-all hover:shadow-lg";
  switch (variant) {
    case "emphasized":
      buttonStyles +=
        " bg-primary-active text-white hover:text-black hover:bg-primary-200";
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
