import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import { Institution } from "../../types";
import InstitutionList from "../../components/institutions/InstitutionList";
import Loading from "../../components/generic/Loading";
import ErrorMessage from "../../components/generic/ErrorMessage";
import { request } from "../../lib";

export default function InstitutionSelection() {
  function getInstitutions(): Promise<Institution[]> {
    return request<Institution[]>("/api/institutions");
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
            `http://127.0.0.1:5005/api/institutions/${selectedInstitution.id}/launch`
          );
        }}
      />
    );
  } else {
    return null;
  }
}
