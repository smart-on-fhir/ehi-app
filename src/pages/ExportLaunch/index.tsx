import Client from "fhirclient/lib/Client";
import { useEffect, useState } from "react";
import { useSMARTContext } from "../../context/smartContext";
import CodeBlock from "../../components/CodeBlock";
import { useNavigate } from "react-router";
import Button from "../../components/Button";

function ClientError({ error }: { error: Error | null }) {
  return (
    <>
      <h1>There was an error in authenticating to the client</h1>
      <CodeBlock>{JSON.stringify(error)}</CodeBlock>
    </>
  );
}
function Loading() {
  return <h1>Kicking off ehi export...</h1>;
}
function EhiError({ ehiError }: { ehiError: Error | null }) {
  return (
    <>
      <h1>There was an error with EHI Export</h1>
      <CodeBlock>{JSON.stringify(ehiError)}</CodeBlock>
    </>
  );
}

export default function App() {
  const SMART = useSMARTContext();
  const navigate = useNavigate();
  const { client, loading, error, completeAuthorization } = SMART;
  const [ehiError, setEhiError] = useState<Error | null>(null);
  const [ehiLink, setEhiLink] = useState<string | null>(null);

  // Complete authorization on initial page load
  useEffect(() => {
    completeAuthorization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger EHI Export when there is an authorized client
  useEffect(() => {
    let unmounted = false;
    async function ehiExport(client: Client | null) {
      const { response } = await client
        ?.request({
          url: `/Patient/${client.getPatientId()}/$ehi-export`,
          method: "POST",
          includeResponse: true,
        })
        .catch((err) => setEhiError(err));
      const link = response.headers.get("Link");
      if (link) {
        // If there is a patient-interaction link, redirect the user there
        const [href, rel] = link.split(/\s*;\s*/);
        if (href && rel === 'rel="patient-interaction"') {
          setEhiLink(href);
        }
      } else {
        // Otherwise return to the homepage
        navigate("/");
      }
    }
    // Only run export if we haven't unmounted and there is a client
    if (client) {
      !unmounted && ehiExport(client);
    }
    // Cleanup flag to avoid duplicate export requests
    // TODO on next PR, replace with AbortController
    return () => {
      unmounted = true;
    };
  }, [client, error, loading, navigate]);

  if (error) {
    return <ClientError error={error} />;
  } else if (ehiError) {
    return <EhiError ehiError={ehiError} />;
  } else if (loading) {
    return <Loading />;
  } else if (ehiLink) {
    // Export succeeded, but there is additional user interaction needed
    return (
      <>
        <div className="mt-4 max-w-screen-sm rounded-md border bg-white p-4">
          <h1 className="text-lg font-bold">Additional information required</h1>
          <p>
            In order for the EHI Export request to be processed, there is an
            additional form to complete.
          </p>
          <div className="mt-2 flex justify-between">
            <Button onClick={() => navigate("/")} display="Finish Later" />
            <Button
              onClick={() => (window.location.href = ehiLink)}
              display="Complete Form"
            />
          </div>
        </div>
      </>
    );
  } else {
    // Export was successful, there was no link, we should redirect to the main page in above effects
    return null;
  }
}
