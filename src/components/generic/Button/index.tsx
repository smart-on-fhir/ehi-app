type ButtonSize = "md" | "lg";
type ButtonVariant = "primary" | "emphasized" | "danger";

type ButtonProps = {
  /**
   * What happens when someone clicks on the button
   * @param event a click event handler
   */
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  /**
   * The contents of the button (e.g. a Component, or another primitive render type like string, number, etc)
   */
  children: React.ReactNode;
  /**
   * Optional classes
   */
  className?: string;
  /**
   * Should the button autofocus
   */
  autoFocus?: boolean;
  /**
   * Whether or not the button is disabled
   */
  disabled?: boolean;
  /**
   * Size of the button to render;
   */
  size?: ButtonSize;
  /**
   * Variant styling to use;
   */
  variant?: ButtonVariant;
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
    "cursor-pointer border rounded text-center px-2 py-1 transition-all hover:shadow-lg";
  // Size-specific styles
  switch (size) {
    case "lg":
      buttonStyles += " h-12 w-44 text-xl";
  }
  // Disabled-specific styling
  if (disabled) {
    buttonStyles +=
      " disabled:italic disabled:bg-opacity-80 disabled:hover:shadow-none disabled:pointer-events-none ";
  }
  // Variant-specific coloring
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
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${className ? className : ""} ${buttonStyles} `}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
}
