import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { useCallback } from "react";
import { ExportJob } from "../../types";
import { useAsync } from "../../hooks/useAsync";
import { canJobChangeStatus, getExportJob } from "../../lib/exportJobHelpers";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import ExportJobDetailView from "../../components/ExportJobDetailView";
import { usePolling } from "../../hooks/usePolling";

export default function ExportJobViewer() {
  const { id } = useParams();
  function getExportJobWithId(signal?: AbortSignal): Promise<ExportJob> {
    if (id) return getExportJob(id, signal);
    else throw Error("Error in viewing a job: there was no id");
  }

  const {
    execute: refreshJob,
    loading,
    result: job,
    error,
  } = useAsync<ExportJob>(useCallback(getExportJobWithId, [id]), true);

  // Poll for job changes if the current status is one that can change
  const pollingCondition = useCallback(() => {
    if (job === null) return false;
    return canJobChangeStatus(job);
  }, [job]);

  usePolling(refreshJob, pollingCondition);

  function BackLink() {
    return (
      <Link to="/admin/jobs" className="mb-2 block">
        ◀ Back to Admin Export List
      </Link>
    );
  }

  // Show loading component whole the job is being loaded
  if (loading && job === null) {
    return (
      <>
        <BackLink />
        <Loading display="Loading job details..." />
      </>
    );
  }

  // If the job failed to load exit with an error message
  if (error) {
    console.log(error);
    return (
      <>
        <BackLink />
        <ErrorMessage
          display={`Error fetching job with id "${id}".`}
          error={error}
        />
      </>
    );
  }

  // If the job request was successful but did not return the expected data exit with an error message
  if (!job) {
    return (
      <>
        <BackLink />
        <ErrorMessage
          error={new Error("")}
          display={`Fetching job with id "${id}" produced empty response.`}
        />
      </>
    );
  }
  return (
    <>
      <BackLink />
      <ExportJobDetailView job={job} refreshJob={refreshJob} />
    </>
  );
}
