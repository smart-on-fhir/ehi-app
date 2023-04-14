import { useParams } from "react-router";
import { useCallback } from "react";
import { ExportJob } from "../../types";
import { useAsync } from "../../hooks/useAsync";
import { getExportJob } from "../../lib/exportJobHelpers";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import CodeBlock from "../../components/CodeBlock";
import ExportJobDetailView from "../../components/ExportJobDetailView";

export default function ExportJobViewer() {
  const { id } = useParams();
  function exportJobWithId(signal?: AbortSignal): Promise<ExportJob> {
    if (id) return getExportJob(id, signal);
    else throw Error("Error in viewing a job: there was no id");
  }

  const {
    loading,
    result: job,
    error,
  } = useAsync<ExportJob>(useCallback(exportJobWithId, [id]), true);

  // Show loading component whole the job is being loaded
  if (loading) {
    return (
      <>
        <Loading display="Loading job details..." />;
      </>
    );
  }

  // If the job failed to load exit with an error message
  if (error) {
    return (
      <ErrorMessage
        display={`Error fetching job with id "${id}": ${error}`}
        error={error}
      />
    );
  }

  // If the job request was successful but did not return the expected data exit with an error message
  if (!job) {
    return (
      <ErrorMessage
        error={new Error("")}
        display={`Fetching job with id "${id}" produced empty response`}
      />
    );
  }

  return (
    <>
      <ExportJobDetailView job={job} />
      <h1>Debugging</h1>
      <CodeBlock>{JSON.stringify(job, null, 2)}</CodeBlock>
    </>
  );
}
