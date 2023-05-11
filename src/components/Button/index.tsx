type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  variant?: "primary" | "emphasized";
};

export default function Button({
  onClick,
  children,
  className,
  disabled,
  autoFocus,
  variant = "primary",
}: ButtonProps) {
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
    <button
      type="button"
      disabled={disabled}
      className={`${
        className
          ? className
          : "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:italic disabled:text-gray-600"
      } ${buttonStyles}`}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
