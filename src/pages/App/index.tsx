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
  const [exported, setExported] = useSessionStorage("exported", false);
  const { client, loading, setInstitution, completeAuthorization } = SMART;

  async function ehiExport(client: Client | null) {
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
  }

  useEffect(() => {
    getInstitutions().then((institutions: Array<Institution>) =>
      setInstitutions(institutions)
    );
  }, []);

  useEffect(() => {
    completeAuthorization();
  }, []);

  // useEffect(() => {
  //   if (!loading && client && !exported) {
  //     ehiExport(client);
  //     setExported(true);
  //   }
  // }, [loading, client]);

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
