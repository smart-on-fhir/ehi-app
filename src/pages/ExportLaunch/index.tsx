import { useEffect, useState } from "react";
import { useSMARTContext } from "../../context/smartContext";
import { useNavigate } from "react-router";
import ehiExport from "../../lib/ehiExport";
import Button from "../../components/Button";
import LinkButton from "../../components/LinkButton";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";

export default function App() {
  const SMART = useSMARTContext();
  const navigate = useNavigate();
  const { client, loading, error } = SMART;
  const [ehiError, setEhiError] = useState<Error | null>(null);
  const [ehiLink, setEhiLink] = useState<string | null>(null);

  // Trigger EHI Export when there is an authorized client
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (client) {
      ehiExport(client, signal)
        .then((link) => {
          if (link) {
            setEhiLink(link);
          } else {
            navigate("/");
          }
        })
        .catch((error: Error) => {
          // Track any non-abort errors with state
          if (error.name !== "AbortError") {
            setEhiError(error);
          }
        });
    }
    return () => {
      abortController.abort();
      setEhiError(null);
    };
  }, [client, error, loading, navigate]);

  if (loading) {
    return <Loading display="Loading client for export" />;
  } else if (error) {
    return (
      <ErrorMessage
        display="There was an error in authenticating to the client"
        error={error}
      />
    );
  } else if (ehiError) {
    return (
      <ErrorMessage
        display="There was an error with EHI Export"
        error={ehiError}
      />
    );
  } else if (ehiLink) {
    // Export succeeded, but there is additional user interaction needed
    return (
      <div className="mx-auto mt-4 max-w-screen-sm rounded border bg-white p-4">
        <h1 className="text-lg font-bold">Additional information required</h1>
        <p>
          In order for the EHI Export request to be processed, there is an
          additional form to complete.
        </p>
        <div className="mt-2 flex justify-between">
          <LinkButton to="/">Finish Later</LinkButton>
          <Button
            autoFocus
            onClick={() => (window.location.href = ehiLink)}
            variant="secondary"
          >
            Complete Form
          </Button>
        </div>
      </div>
    );
  } else {
    // Export was successful, there was no link; we should be redirecting to the main page in above effect
    return null;
  }
}
