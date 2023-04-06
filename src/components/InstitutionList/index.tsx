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
      <div className="my-2 max-h-[500px] max-w-lg overflow-auto">
        <h1 className="mb-2 ">Select an Institution to Export Data From</h1>
        <ul className="border border-gray-600">
          {institutions.map((institution) => (
            <li
              key={institution.displayName}
              className={`flex h-12 items-center border-b border-gray-600 px-2 last:border-none hover:bg-blend-darken  ${
                institution.clickable
                  ? "cursor-pointer hover:bg-gray-200"
                  : "bg-gray-300 italic text-gray-600"
              }`}
              onClick={() =>
                institution.clickable && setInstitution(institution)
              }
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
      </div>
    );
  }
}
