type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  variant?: "primary" | "emphasized";
};

export default function Button({
  onClick,
  children,
  className,
  autoFocus,
  variant = "primary",
}: ButtonProps) {
  let buttonStyles =
    "cursor-pointer border px-2 py-1 transition-all hover:shadow-lg";
  switch (variant) {
    case "emphasized":
      buttonStyles += " bg-primary-400 text-white hover:bg-primary-800";
      break;
    case "primary":
      buttonStyles += " hover:bg-primary-200 bg-primary-50";
      break;
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
