import { useEffect } from "react";
import { useSMART } from "../context/smartContext";

export default function Launch() {
  const { startAuthorization } = useSMART();

  useEffect(() => {
    startAuthorization();
  }, [startAuthorization]);

  return <b>Launching...</b>;
}
