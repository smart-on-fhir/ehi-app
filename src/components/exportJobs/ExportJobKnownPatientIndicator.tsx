type KnownPatientIndicatorProps = {
  knownPatientId: boolean | undefined;
};

/**
 * Render a sentence fragment to visually indicate if this is a known patient
 * @param knownPatientId whether or not to display this indicator
 * @returns some stylized text with a leading comma
 */
export default function KnownPatientIndicator({
  knownPatientId,
}: KnownPatientIndicatorProps) {
  if (knownPatientId) {
    return (
      <>
        <span className="opacity-50">{", "}</span>
        <span
          className="font-bold text-red-600 opacity-100"
          title="This job is associated with a patient used in the patient-facing app."
        >
          Your Patient
        </span>
      </>
    );
  } else {
    return null;
  }
}
