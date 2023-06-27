import { Link, To } from "react-router-dom";

type LinkButtonProps = {
  to: To;
  children: React.ReactNode;
  target?: string;
  download?: boolean;
  className?: string;
  size?: "md" | "lg";
  variant?: "primary" | "emphasized";
};

export default function LinkButton({
  to,
  children,
  className,
  download = false,
  target = "",
  size = "md",
  variant = "primary",
}: LinkButtonProps) {
  let buttonStyles =
    "cursor-pointer border rounded text-center px-2 py-1 transition-all hover:shadow-lg";
  switch (variant) {
    case "emphasized":
      buttonStyles +=
        " flex items-center justify-center bg-active text-white hover:bg-active-dark";
      break;
    case "primary":
      buttonStyles += " bg-primary-50 hover:bg-primary-100";
      break;
  }
  switch (size) {
    case "lg":
      buttonStyles += " h-12 w-44 text-xl";
  }
  return (
    <Link
      download={download}
      target={target}
      to={to}
      className={`${buttonStyles} ${className ? className : ""}`}
    >
      {children}
    </Link>
  );
}
