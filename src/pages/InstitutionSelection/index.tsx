import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAsync } from "../../hooks/useAsync";
import InstitutionList from "../../components/InstitutionList";
import { getInstitutions } from "../../lib/institutionHelpers";
import { Institution } from "../../types";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function InstitutionSelection() {
  const navigate = useNavigate();
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
        display="There was an error loading institutions"
      />
    );
  } else if (institutions) {
    return (
      <InstitutionList
        institutions={institutions}
        setInstitution={(institution) => {
          navigate("/launch", { state: { institution } });
        }}
      />
    );
  } else {
    return null;
  }
}
