import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import InstitutionList from "../../components/InstitutionList";
import { Institution } from "../../types";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function InstitutionSelection() {
  function getInstitutions(): Promise<Institution[]> {
    return fetch("/api/institutions").then((resp) => resp.json());
  }

  const {
    loading,
    result: institutions,
    error,
  } = useAsync<Institution[]>(useCallback(getInstitutions, []), true);

  if (loading) {
    return <Loading display="Loading institutions..." />;
  } else if (error) {
    return (
      <ErrorMessage
        error={error}
        display="There was an error loading institutions."
      />
    );
  } else if (institutions) {
    return (
      <InstitutionList
        institutions={institutions}
        setInstitution={(selectedInstitution) => {
          window.location.assign(
            `http://localhost:5005/api/institutions/${selectedInstitution.id}/launch`
          );
        }}
      />
    );
  } else {
    return null;
  }
}
