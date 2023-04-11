import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSMARTContext } from "../../context/smartContext";
import { useInstitutionContext } from "../../context/institutionContext";
import CodeBlock from "../../components/CodeBlock";
import InstitutionList from "../../components/InstitutionList";
import { Institution } from "../../types";
import getInstitutions from "../../lib/getInstitutions";

export default function InstitutionSelection() {
  const navigate = useNavigate();
  const SMART = useSMARTContext();
  const { institution, setInstitution } = useInstitutionContext();
  // List of institutions to be loaded
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const { completeAuthorization } = SMART;

  useEffect(() => {
    // If an institution has been selected, go to the launch page
    if (institution) {
      navigate("/launch");
    }
    // Load available institutions on the initial render
    getInstitutions().then((institutions: Institution[]) =>
      setInstitutions(institutions)
    );
    // On PageLoad, try to authorize
    completeAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, navigate]);

  return (
    <>
      <InstitutionList
        institutions={institutions}
        setInstitution={setInstitution}
      />
      <h1>Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock>
    </>
  );
}
