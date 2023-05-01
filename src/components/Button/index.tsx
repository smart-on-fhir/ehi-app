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
    "cursor-pointer border px-2 py-1 transition-all hover:shadow-sm";
  switch (variant) {
    case "emphasized":
      buttonStyles += " bg-slate-600 text-white hover:bg-slate-800";
      break;
    case "primary":
      buttonStyles += " hover:bg-white";
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
