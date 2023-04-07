import { Dispatch, SetStateAction } from "react";
import { Institution } from "../../types";
import InstitutionOption from "../InstitutionOption";

type InstitutionListProps = {
  institutions: Institution[];
  setInstitution: Dispatch<SetStateAction<Institution | null>>;
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
            <InstitutionOption
              institution={institution}
              setInstitution={setInstitution}
            />
          ))}
        </ul>
      </div>
    );
  }
}
