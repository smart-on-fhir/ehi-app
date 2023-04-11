import Client from "fhirclient/lib/Client";
import { useEffect } from "react";
import { useSMARTContext } from "../../context/smartContext";
import CodeBlock from "../../components/CodeBlock";

export default function App() {
  const SMART = useSMARTContext();
  const { client, completeAuthorization } = SMART;

  // Export after completing authorization
  useEffect(() => {
    let unmounted = false;
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
    completeAuthorization().then((client) => {
      if (client) {
        // Only run export if we haven't unmounted
        !unmounted && ehiExport(client);
      } else {
        console.log("there was an error in authorization, export impossible");
      }
    });
    // Cleanup flag to avoid duplicate export requests
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
      <h1>Kicking off ehi export...</h1>
    </>
  );
}
