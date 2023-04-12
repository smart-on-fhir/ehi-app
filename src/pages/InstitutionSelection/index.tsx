import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InstitutionList from "../../components/InstitutionList";
import { getInstitutions } from "../../lib/institutionHelpers";
import { Institution } from "../../types";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function InstitutionSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  useEffect(() => {
    setLoading(true);
    getInstitutions()
      .then((institutions: Institution[]) => setInstitutions(institutions))
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading display="Loading institutions..." />;
  } else if (error) {
    return (
      <ErrorMessage
        error={error}
        display="There was an error loading institutions"
      />
    );
  } else {
    return (
      <InstitutionList
        institutions={institutions}
        setInstitution={(institution) => {
          navigate("/launch", { state: { institution } });
        }}
      />
    );
  }
}
