import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InstitutionList from "../../components/InstitutionList";
import getInstitutions from "../../lib/getInstitutions";
import { Institution } from "../../types";

export default function InstitutionSelection() {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    // If an institution has been selected, go to the launch page
    if (institution) {
      navigate("/launch", { state: { institution } });
    }
    // Load available institutions on the initial render
    getInstitutions().then((institutions: Institution[]) =>
      setInstitutions(institutions)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institution, navigate]);

  return (
    <>
      <InstitutionList
        institutions={institutions}
        setInstitution={setInstitution}
      />
      <h1>Debugging Purposes</h1>
    </>
  );
}
