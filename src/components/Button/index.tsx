type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  children: React.ReactNode;
};

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      className="border px-2 py-1 transition-all hover:bg-white hover:shadow-sm"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
