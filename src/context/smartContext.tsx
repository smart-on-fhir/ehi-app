import * as React from "react";
import { useAsync } from "../hooks/useAsync";
import Client from "fhirclient/lib/Client";
import { fhirclient } from "fhirclient/lib/types";
import { oauth2 as SMART } from "fhirclient";
import { SMARTContextInterface } from "../types";

let SMARTContext = React.createContext<SMARTContextInterface>(null!);

export function SMARTProvider({ children }: { children: React.ReactNode }) {
  const {
    execute: completeAuthorization,
    loading,
    result: client,
    error,
  } = useAsync<Client>(React.useCallback(() => SMART.ready(), []));

  function startAuthorization(options?: fhirclient.AuthorizeParams) {
    console.log("starting auth");
    return SMART.authorize({
      // the only ID that server supports
      clientId: "test_client_id",

      // the only scopes that server understands
      scope: "offline_access patient/$ehi-export",

      // where to go after auth to actually start the app
      redirectUri: "/exportLaunch",

      // Passing iss makes this a standalone launch; default is the EHI server
      iss: `${process!.env!.REACT_APP_EHI_SERVER}/fhir`,

      // Override with custom options if any
      ...options,
    });
  }

  React.useEffect(() => {
    if (!client) {
      completeAuthorization();
    }
  }, [client, completeAuthorization]);

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
