import Client from "fhirclient/lib/Client";
import { useEffect, useState } from "react";
import { useSMART } from "../../context";
import "./App.css";
// import Button from "../../components/Button";
import CodeBlock from "../../components/CodeBlock";
import InstitutionList from "../../components/InstitutionList";
import { Institution } from "../../types";
import getInstitutions from "../../lib/getInstitutions";
import useSessionStorage from "../../hooks/useSessionStorage";

export default function App() {
  const SMART = useSMART();
  const [institutions, setInstitutions] = useState([] as Array<Institution>);
  const {
    client,
    loading,
    setInstitution,
    toExport,
    setToExport,
    completeAuthorization,
  } = SMART;

  // Load available institutions on the initial render
  useEffect(() => {
    getInstitutions().then((institutions: Array<Institution>) =>
      setInstitutions(institutions)
    );
  }, []);

  // On PageLoad, try to authorize
  useEffect(() => {
    completeAuthorization();
  }, []);

  // After Authorization is complete, load jobs
  useEffect(() => {
    if (!loading && client) {
    }
  }, [loading, client]);

  // After Loading jobs and authorizing, export if necessary

  useEffect(() => {
    async function ehiExport(client: Client) {
      const { response } = await client?.request({
        url: `/Patient/${client.getPatientId()}/$ehi-export`,
        method: "POST",
        includeResponse: true,
      });
      const link = response.headers.get("Link");

      if (link) {
        console.log("=>", link);
        const [href, rel] = link.split(/\s*;\s*/);
        console.log(href, rel);
        if (href && rel === 'rel="patient-interaction"') {
          window.location.href = href;
        }
      }
      setToExport(false);
    }
    if (!loading && client && toExport) {
      ehiExport(client);
    }
  }, [loading, client, toExport, setToExport]);

  return (
    <>
      <InstitutionList
        institutions={institutions}
        setInstitution={(i: Institution) => {
          setInstitution(i);
          console.log("setting to export");
          setToExport(true);
        }}
      />
      <h1>Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock>
    </>
  );
}
