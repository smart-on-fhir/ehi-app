type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  className?: string;
  autoFocus?: boolean;
  variant: "primary" | "secondary";
};

export default function Button({
  onClick,
  children,
  className,
  autoFocus,
  variant,
}: ButtonProps) {
  let buttonStyles =
    "cursor-pointer border px-2 py-1 transition-all hover:shadow-sm";
  switch (variant) {
    case "primary":
      buttonStyles += " bg-slate-600 text-white hover:bg-slate-800";
      break;
    case "secondary":
      buttonStyles += " hover:bg-white";
      break;
  }

  return (
    <button
      className={`${className ? className : ""} ${buttonStyles}`}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
