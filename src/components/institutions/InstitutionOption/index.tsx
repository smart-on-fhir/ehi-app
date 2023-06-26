import InstitutionIcon from "./institution-logo.svg";

type InstitutionOptionProps = {
  institution: EHIApp.Institution;
  setInstitution: (selectedInstitution: EHIApp.Institution) => void;
};

export default function InstitutionOption({
  institution,
  setInstitution,
}: InstitutionOptionProps) {
  const LOCALHOST_INSTITUTION_ID = 2;
  const { disabled: disabledNum, displayName, id, location } = institution;
  // Special case: Disable if id corresponds to the localhost institution & env is prod
  const disabled =
    Boolean(disabledNum) ||
    (LOCALHOST_INSTITUTION_ID === 2 && process.env.NODE_ENV === "production");
  console.log(disabled);
  return (
    <li
      className={`flex h-16 items-center px-2 first:rounded-t last:rounded-b ${
        disabled
          ? "bg-gray-100 italic text-gray-600"
          : "cursor-pointer bg-white hover:bg-primary-100"
      }`}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && setInstitution(institution)}
      onKeyDown={(e) => {
        !disabled && e.key === "Enter" && setInstitution(institution);
      }}
    >
      <img
        src={InstitutionIcon}
        className={`inline h-8 w-8 object-contain ${disabled && "opacity-50"}`}
        alt={`Logo associated with ${displayName}`}
      />
      <div className="ml-2 inline">
        <h1 className="block font-bold ">
          {displayName}
          {disabled && ", not available"}
        </h1>
        {location && (
          <span className="block text-sm text-gray-600">{location}</span>
        )}
      </div>
    </li>
  );
}
