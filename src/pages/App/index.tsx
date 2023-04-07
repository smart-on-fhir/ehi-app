import Client from "fhirclient/lib/Client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSMARTContext } from "../../context/smartContext";
import { useInstitutionContext } from "../../context/institutionContext";
import "./App.css";
// import Button from "../../components/Button";
import CodeBlock from "../../components/CodeBlock";
import InstitutionList from "../../components/InstitutionList";
import { Institution } from "../../types";
import getInstitutions from "../../lib/getInstitutions";

export default function App() {
  const navigate = useNavigate();
  const SMART = useSMARTContext();
  const { institution, setInstitution } = useInstitutionContext();
  // List of institutions to be loaded
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const { completeAuthorization } = SMART;

  // Load available institutions on the initial render
  useEffect(() => {
    getInstitutions().then((institutions: Institution[]) =>
      setInstitutions(institutions)
    );
  }, []);

  // If an institution has been selected, go to the launch page
  useEffect(() => {
    if (institution) {
      navigate("/launch");
    }
  }, [institution, navigate]);

  // On PageLoad, try to authorize
  useEffect(() => {
    completeAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
