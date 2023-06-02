import { Dispatch, SetStateAction } from "react";
import { Institution } from "../../types";
import InstitutionOption from "../InstitutionOption";
import HeadingOne from "../HeadingOne";

type InstitutionListProps = {
  institutions: Institution[];
  setInstitution: Dispatch<SetStateAction<Institution | null>>;
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
          <li className="flex h-16 items-center px-2 cursor-pointer bg-white hover:bg-primary-100">
            <a href="http://localhost:5005/api/institutions/1/launch">TEST LAUNCH (https://ehi-server.herokuapp.com/fhir)</a>
          </li>
          <li className="flex h-16 items-center px-2 cursor-pointer bg-white hover:bg-primary-100">
            <a href="http://localhost:5005/api/institutions/2/launch">TEST LAUNCH (http://localhost:8888/fhir)</a>
          </li>
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
