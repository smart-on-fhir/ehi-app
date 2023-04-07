import { useEffect } from "react";
import { useSMARTContext } from "../context/smartContext";
import { useInstitutionContext } from "../context/institutionContext";

export default function Launch() {
  const { startAuthorization } = useSMARTContext();
  const { institution } = useInstitutionContext();

  useEffect(() => {
    startAuthorization({
      iss: institution?.fhirUrl,
    });
  }, [startAuthorization]);

  return <b>Launching...</b>;
}
