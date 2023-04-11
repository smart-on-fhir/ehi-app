import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInstitutionContext } from "../../context/institutionContext";
import CodeBlock from "../../components/CodeBlock";
import InstitutionList from "../../components/InstitutionList";
import { Institution } from "../../types";
import getInstitutions from "../../lib/getInstitutions";

export default function InstitutionSelection() {
  const navigate = useNavigate();
  const { institution, setInstitution } = useInstitutionContext();
  // List of institutions to be loaded
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    // If an institution has been selected, go to the launch page
    if (institution) {
      navigate("/launch");
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
