import { useCallback } from "react";
import { useAsync } from "../hooks/useAsync";
import ExportJobListItemUser from "../components/exportJobs/ExportJobListItemUser";
import LinkButton from "../components/generic/LinkButton";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import HeadingOne from "../components/generic/HeadingOne";
import { getExportJobs, canJobChangeStatus } from "../lib/exportJobHelpers";
import { Plus } from "react-feather";
import { usePolling } from "../hooks/usePolling";

export default function UserExportJobList() {
  const {
    execute: syncJobs,
    loading,
    result: jobs,
    error,
  } = useAsync<EHIApp.ExportJobSummary[]>(useCallback(getExportJobs, []), true);

  // Poll for job changes if we have any that can change status
  const pollingCondition = useCallback(() => {
    if (jobs === null) return false;
    return jobs.some(canJobChangeStatus);
  }, [jobs]);
  usePolling(syncJobs, pollingCondition);

  function PageBody() {
    if (loading && jobs === null) {
      return <Loading display="Loading health record requests..." />;
    } else if (error) {
      return (
        <ErrorMessage
          error={error}
          display="There was an error loading health record requests."
        />
      );
    } else if (jobs) {
      return (
        <ul className="space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => <ExportJobListItemUser key={job.id} job={job} />)
          ) : (
            <>
              <p>No exports were found on the server.</p>
              <p>
                Click the "New Export" button to start exporting your electronic
                health information from any supported institution.
              </p>
            </>
          )}
        </ul>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <div className="flex items-baseline justify-between">
        <HeadingOne>My EHI Exports</HeadingOne>
        <LinkButton variant="emphasized" size="lg" to="/institutionSelection">
          <Plus size={16} className="mr-2 inline" />
          New Export
        </LinkButton>
      </div>
      <PageBody />
    </>
  );
}
