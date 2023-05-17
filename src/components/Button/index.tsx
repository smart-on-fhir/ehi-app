type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  size?: "md" | "lg";
  variant?: "primary" | "emphasized" | "danger";
};

export default function Button({
  onClick,
  children,
  className,
  autoFocus,
  disabled,
  size = "md",
  variant = "primary",
}: ButtonProps) {
  let buttonStyles =
    "cursor-pointer border text-center px-2 py-1 transition-all hover:shadow-lg";
  // Special case: Disabled buttons shouldn't apply any other special styling
  if (disabled) {
    buttonStyles +=
      " disabled:italic disabled:border-gray-700 disabled:text-gray-700 disabled:hover:shadow-none disabled:pointer-events-none disabled:cursor-default disabled:bg-gray-200";
    return (
      <button
        type="button"
        disabled={true}
        className={`${className ? className : ""}   ${buttonStyles}`}
        onClick={onClick}
        autoFocus={autoFocus}
      >
        {children}
      </button>
    );
  }
  switch (variant) {
    case "emphasized":
      buttonStyles += " bg-active text-white hover:bg-active-dark";
      break;
    case "primary":
      buttonStyles += " bg-primary-50 hover:bg-primary-100";
      break;
    case "danger":
      buttonStyles += " bg-alert hover:bg-alert-dark text-white";
      break;
  }
  switch (size) {
    case "lg":
      buttonStyles += " h-12 w-44 text-xl";
  }
  return (
    <button
      type="button"
      className={`${className ? className : ""} ${buttonStyles}`}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
