import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import ExportJobDetailView from "../components/exportJobs/ExportJobDetailView";
import { usePolling } from "../hooks/usePolling";
import { getExportJob } from "../api/adminApiHandlers";
import { useAsyncJob } from "../hooks/useAsyncJob";

export default function ExportJobViewer() {
  const { id } = useParams();
  function getExportJobWithId(signal?: AbortSignal): Promise<EHIApp.ExportJob> {
    if (id) return getExportJob(+id, signal);
    else throw Error("Error in viewing a job: there was no id");
  }

  // Custom hook that allows for updating of jobs directly, in addition to wrapping a getter
  const { refreshJob, updateJob, loading, job, error } =
    useAsyncJob<EHIApp.ExportJob>(getExportJobWithId);

  // Always check for job updates regularly
  usePolling(refreshJob);

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
      <ExportJobDetailView job={job} updateJob={updateJob} />
    </>
  );
}
