import Client from "fhirclient/lib/Client";
import { fhirclient } from "fhirclient/lib/types";
import { oauth2 as SMART } from "fhirclient";
import * as React from "react";

interface SMARTContextInterface {
  client: Client | null;
  error: Error | null;
  loading: boolean;
  startAuthorization: (options?: fhirclient.AuthorizeParams) => Promise<any>;
  completeAuthorization: () => Promise<Client | void>;
}

let SMARTContext = React.createContext<SMARTContextInterface>(null!);

export function SMARTProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = React.useState<Error | null>(null);
  const [client, setClient] = React.useState<Client | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  function startAuthorization(options?: fhirclient.AuthorizeParams) {
    return SMART.authorize({
      // the only ID that server supports
      clientId: "test_client_id",

      // the only scopes that server understands
      scope: "offline_access patient/$ehi-export",

      // where to go after auth to actually start the app
      redirectUri: "/exportLaunch",

      // Passing iss makes this a standalone launch; default is the EHI server
      iss: "https://ehi-server.herokuapp.com/fhir",

      // Override with custom options if any
      ...options,
    });
  }

  function completeAuthorization() {
    setLoading(true);
    return SMART.ready()
      .then(
        (client) => {
          setClient(client);
          return client;
        },
        (error) => {
          setError(error);
        }
      )
      .finally(() => setLoading(false));
  }

  return (
    <SMARTContext.Provider
      value={{
        startAuthorization,
        completeAuthorization,
        error,
        client,
        loading,
      }}
    >
      {children}
    </SMARTContext.Provider>
  );
}

export function useSMARTContext() {
  return React.useContext(SMARTContext);
}
