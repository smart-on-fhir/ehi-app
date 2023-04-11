import { useEffect } from "react";
import { useLocation } from "react-router";
import { fhirclient } from "fhirclient/lib/types";
import { useSMARTContext } from "../context/smartContext";

export default function Launch() {
  const { startAuthorization } = useSMARTContext();
  let location = useLocation();

  useEffect(() => {
    let config: fhirclient.AuthorizeParams = {};
    if (location.state.institution) {
      config.iss = location.state.institution.fhirUrl;
    }
    startAuthorization(config);
  }, [location.state.institution, startAuthorization]);

  return <b>Launching...</b>;
}
