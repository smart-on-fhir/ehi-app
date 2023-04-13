type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
  className?: string;
};

export default function Button({ onClick, children, className }: ButtonProps) {
  return (
    <button
      className={`border px-2 py-1 transition-all hover:bg-white hover:shadow-sm ${
        className ? className : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
