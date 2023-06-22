export default function Badge({
  display,
  detailedInformation,
  className,
}: {
  display: string;
  detailedInformation?: string;
  className?: string;
}) {
  return (
    <span
      className={`rounded-xl border bg-active px-1.5 py-0.5 text-xs text-white ${
        className ? className : ""
      }`}
      title={detailedInformation || display}
    >
      {display}
    </span>
  );
}
