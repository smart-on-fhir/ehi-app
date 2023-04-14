import { useParams } from "react-router";
import { useCallback, useEffect } from "react";
import { ExportJob } from "../../types";
import { useAsync } from "../../hooks/useAsync";
import { getExportJob } from "../../lib/exportJobHelpers";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import CodeBlock from "../../components/CodeBlock";

export default function ExportJobViewer() {
  const { id } = useParams();
  function exportJobWithId(signal?: AbortSignal): Promise<ExportJob> {
    if (id) return getExportJob(id, signal);
    else throw Error("Error in viewing a job: there was no id");
  }

  const { loading, result, error } = useAsync<ExportJob>(
    useCallback(exportJobWithId, [id]),
    true
  );

  // Show loading component whole the job is being loaded
  if (loading) {
    return (
      <>
        <Loading display="Loading job details..." />;
      </>
    );
  }

  // If the subscription failed to load exit with an error message
  if (error) {
    return (
      <ErrorMessage
        display={`Error fetching subscription with id "${id}": ${error}`}
        error={error}
      />
    );
  }

  // If the subscription request was successful but did not return the expected data exit with an error message
  if (!result) {
    return (
      <ErrorMessage
        error={new Error("")}
        display={`Fetching subscription with id "${id}" produced empty response`}
      ></ErrorMessage>
    );
  }

  return (
    <>
      <CodeBlock>{JSON.stringify(result, null, 2)}</CodeBlock>
    </>
  );
}
