interface BadgeProps {
  /**
   * Content of the badge
   */
  display: string;
  /**
   * An optional detailed description of what the badge means, used to fulfill the title attribute
   */
  detailedInformation?: string;
  /**
   * Optional classes
   */
  className?: string;
}

export default function Badge({
  display,
  detailedInformation,
  className,
}: BadgeProps) {
  return (
    <span
      className={`rounded-xl border bg-active px-1.5 py-0.5 text-xs font-bold text-white ${
        className ? className : ""
      }`}
      title={detailedInformation || display}
    >
      {display}
    </span>
  );
}
