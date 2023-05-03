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
  return (
    <li
      className={`flex h-16 items-center px-2 ${
        institution.disabled
          ? "bg-gray-100 italic text-gray-600"
          : "cursor-pointer bg-white hover:bg-primary-100"
      }`}
      tabIndex={institution.disabled ? -1 : 0}
      onClick={() => !institution.disabled && setInstitution(institution)}
      onKeyDown={(e) => {
        !institution.disabled &&
          e.key === "Enter" &&
          setInstitution(institution);
      }}
    >
      <img
        src={institution.imgUrl}
        className="inline h-8 w-8 object-contain"
        alt={`Logo associated with ${institution.displayName}`}
      />
      <div className="ml-2 inline">
        <h1 className="block font-bold ">
          {institution.displayName}
          {institution.disabled && ", not available"}
        </h1>
        {institution.location && (
          <span className="block text-sm text-gray-600">
            {institution.location}
          </span>
        )}
      </div>
    </li>
  );
}
