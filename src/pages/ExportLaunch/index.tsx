import Client from "fhirclient/lib/Client";
import { useEffect } from "react";
import { useSMART } from "../../context/smartContext";
import CodeBlock from "../../components/CodeBlock";

export default function App() {
  const SMART = useSMART();
  const { client, completeAuthorization } = SMART;

  // After Loading jobs and authorizing, export if necessary
  useEffect(() => {
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
        ehiExport(client);
      } else {
        console.log("there was an error in authorization, export impossible");
      }
    });
    console.log(
      "no client available, there must have been some mistake in the handshake process"
    );
  }, []);

  return (
    <>
      <h1>Kicking off ehi export...</h1>
      <h1>Debugging Purposes</h1>
      <CodeBlock>{JSON.stringify(SMART, null, 4)}</CodeBlock>
    </>
  );
}
