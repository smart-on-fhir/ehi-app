import { Institution } from "../../types";

type InstitutionListProps = {
  institutions: Array<Institution>;
  setInstitution: Function;
};

export default function InstitutionList({
  institutions,
  setInstitution,
}: InstitutionListProps) {
  if (institutions.length === 0) {
    return <></>;
  } else {
    return (
      <ul className="my-2 max-h-[500px] max-w-lg overflow-auto border">
        {institutions.map((institution) => (
          <li
            key={institution.displayName}
            className={`flex h-12 items-center border-b border-gray-600 px-2 ${
              institution.clickable ? "cursor-pointer" : "bg-gray-300"
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
        ))}
      </ul>
    );
  }
}
