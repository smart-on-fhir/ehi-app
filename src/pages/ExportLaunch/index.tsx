import Client from "fhirclient/lib/Client";
import { useEffect } from "react";
import { useSMARTContext } from "../../context/smartContext";
import CodeBlock from "../../components/CodeBlock";

export default function App() {
  const SMART = useSMARTContext();
  const { client, loading, error, completeAuthorization } = SMART;

  // Complete authorization on initial page load
  useEffect(() => {
    completeAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger EHI Export when there is an authorized client
  useEffect(() => {
    let unmounted = false;
    async function ehiExport(client: Client | null) {
      const { response } = await client?.request({
        url: `/Patient/${client.getPatientId()}/$ehi-export`,
        method: "POST",
        includeResponse: true,
      });
      const link = response.headers.get("Link");
      // If there is a patient-interaction link, redirect the user there
      if (link) {
        console.log("=>", link);
        const [href, rel] = link.split(/\s*;\s*/);
        console.log(href, rel);
        if (href && rel === 'rel="patient-interaction"') {
          window.location.href = href;
        }
      }
    }
    // Only run export if we haven't unmounted and there is a client
    if (client) {
      !unmounted && ehiExport(client);
    } else if (error) {
      console.log("there was an error in authorization, export impossible");
    } else if (loading) {
      console.log("still loading the client");
    }
    // Cleanup flag to avoid duplicate export requests
    return () => {
      unmounted = true;
    };
  }, [client, error, loading]);

  return (
    <>
      <h1>Kicking off ehi export...</h1>
    </>
  );
}
