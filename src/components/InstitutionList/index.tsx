import { Institution } from "../../types";
import InstitutionOption from "../InstitutionOption";
import HeadingOne from "../HeadingOne";

type InstitutionListProps = {
  institutions: Institution[];
  setInstitution: (selectedInstitution: Institution) => void;
};

export default function InstitutionList({
  institutions,
  setInstitution,
}: InstitutionListProps) {
  if (institutions.length === 0) {
    return null;
  } else {
    return (
      <div className="max-h-[500px] overflow-auto">
        <HeadingOne>Select Institution for Export</HeadingOne>

        <ul className="divide-y rounded border border-gray-600">
          {institutions.map((institution) => (
            <InstitutionOption
              key={institution.displayName}
              institution={institution}
              setInstitution={setInstitution}
            />
          ))}
        </ul>
      </div>
    );
  }
}
