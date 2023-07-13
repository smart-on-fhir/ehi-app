import { useCallback } from "react";
import { useAsync } from "../hooks/useAsync";
import InstitutionList from "../components/institutions/InstitutionList";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import { request } from "../lib";
import pkg from "../../package.json";

const BASE = process.env.NODE_ENV === "production" ? "" : pkg.proxy;

export default function InstitutionSelection() {
  function getInstitutions(): Promise<EHIApp.Institution[]> {
    return request<EHIApp.Institution[]>("/api/institutions");
  }

  const {
    loading,
    result: institutions,
    error,
  } = useAsync<EHIApp.Institution[]>(useCallback(getInstitutions, []), true);

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
        setInstitution={(selectedInstitution: EHIApp.Institution) => {
          window.location.assign(
            // `http://127.0.0.1:5005/api/institutions/${selectedInstitution.id}/launch`
            `${BASE}/api/institutions/${selectedInstitution.id}/launch`
          );
        }}
      />
    );
  } else {
    return null;
  }
}
