interface BadgeProps {
  /**
   * Content of the badge
   */
  display: string;
  /**
   * Optional detailed description of what the badge means, for example as a title attribute for hover-interactivity
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
