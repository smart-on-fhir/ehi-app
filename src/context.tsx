import Client from "fhirclient/lib/Client";
import { fhirclient } from "fhirclient/lib/types";
import { oauth2 as SMART } from "fhirclient";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Institution } from "./types";
import useSessionStorage from "./hooks/useSessionStorage";

interface SMARTContextInterface {
  client: Client | null;
  error: Error | null;
  institution: Institution | null;
  setInstitution: any;
  loading: boolean;
  toExport: boolean;
  setToExport: any;
  startAuthorization: (options?: fhirclient.AuthorizeParams) => Promise<any>;
  completeAuthorization: () => Promise<void>;
}

let SMARTContext = React.createContext<SMARTContextInterface>(null!);

export function SMARTProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [toExport, setToExport] = useSessionStorage("exported", false);

  const [error, setError] = React.useState<Error | null>(null);
  const [institution, setInstitution] = React.useState<Institution | null>(
    null
  );
  // If an institution has been selected, go to the launch page
  React.useEffect(() => {
    if (institution) {
      navigate("/launch");
    }
  }, [institution, navigate]);

  const [client, setClient] = React.useState<Client | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  function startAuthorization(options?: fhirclient.AuthorizeParams) {
    return SMART.authorize({
      // the only ID that server supports
      clientId: "test_client_id",

      // the only scopes that server understands
      scope: "offline_access patient/$ehi-export",

      // where to go after auth to actually start the app
      redirectUri: "/",

      // Passing iss makes this a standalone launch
      iss: institution?.fhirUrl || "https://ehi-server.herokuapp.com/fhir",

      // Override with custom options if any
      ...options,
    });
  }

  function completeAuthorization() {
    setLoading(true);
    console.log("completing auth");
    return SMART.ready()
      .then(
        (client) => setClient(client),
        (error) => setError(error)
      )
      .finally(() => setLoading(false));
  }

  return (
    <SMARTContext.Provider
      value={{
        institution,
        setInstitution,
        startAuthorization,
        completeAuthorization,
        toExport,
        setToExport,
        error,
        client,
        loading,
      }}
    >
      {children}
    </SMARTContext.Provider>
  );
}

export function useSMART() {
  return React.useContext(SMARTContext);
}
