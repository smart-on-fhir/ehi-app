import { Link, To } from "react-router-dom";

type LinkButtonProps = {
  to: To;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "emphasized";
};

export default function LinkButton({
  to,
  children,
  className,
  disabled,
  variant = "primary",
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
  if (disabled)
    buttonStyles +=
      "bg-gray-100 italic text-gray-600 cursor-default pointer-events-none";
  return (
    <Link to={to} className={`${buttonStyles} ${className ? className : ""}`}>
      {children}
    </Link>
  );
}
