import { Dispatch, SetStateAction } from "react";
import { Institution } from "../../types";

type InstitutionOptionProps = {
  institution: Institution;
  setInstitution: Dispatch<SetStateAction<Institution | null>>;
};

export default function InstitutionOption({
  institution,
  setInstitution,
}: InstitutionOptionProps) {
  const { disabled, imgSrc, displayName, location } = institution;
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
        src={imgSrc}
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
