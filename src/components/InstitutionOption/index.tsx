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
      key={institution.displayName}
      className={`flex h-12 items-center border-b border-gray-600 px-2 last:border-none hover:bg-blend-darken  ${
        institution.clickable
          ? "cursor-pointer hover:bg-gray-200"
          : "bg-gray-300 italic text-gray-600"
      }`}
      onClick={() => institution.clickable && setInstitution(institution)}
    >
      <img
        src={institution.imgUrl}
        className="inline h-8 w-8 object-contain"
        alt={`Logo associated with ${institution.displayName}`}
      />
      <div className="ml-2 inline">
        <h1 className="block font-bold ">{institution.displayName}</h1>
        {institution.location && (
          <span className="block text-sm text-gray-600">
            {institution.location}
          </span>
        )}
      </div>
    </li>
  );
}
