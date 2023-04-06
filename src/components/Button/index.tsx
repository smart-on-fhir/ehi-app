type ButtonProps = {
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  display: string;
};

export default function Button({ onClick, display }: ButtonProps) {
  return (
    <button className="border px-2 py-1" onClick={onClick}>
      {display}
    </button>
  );
}
