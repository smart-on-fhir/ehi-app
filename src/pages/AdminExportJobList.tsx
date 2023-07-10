import { useCallback } from "react";
import { useAsync } from "../hooks/useAsync";
import ExportJobListItemAdmin from "../components/exportJobs/ExportJobListItemAdmin";
import { getExportJobs } from "../api/adminApiHandlers";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import HeadingOne from "../components/generic/HeadingOne";
import { Link } from "react-router-dom";
import { usePolling } from "../hooks/usePolling";

export default function AdminExportJobList() {
  const {
    execute: syncJobs,
    loading,
    result: jobs,
    error,
  } = useAsync<EHIApp.ExportJob[]>(useCallback(getExportJobs, []), true);

  // Always check for new jobs regularly
  usePolling(syncJobs);

  function PageBody() {
    if (loading && jobs === null) {
      return <Loading display={"Loading current export jobs"} />;
    } else if (error) {
      return (
        <ErrorMessage
          error={error}
          display="An error occurred in fetching jobs."
        />
      );
    } else if (jobs && jobs.length > 0) {
      return (
        <ul className="space-y-4">
          {jobs.map((job, i) => (
            <ExportJobListItemAdmin key={job.id} job={job} />
          ))}
        </ul>
      );
    } else {
      return (
        <div className="space-y-4">
          <p>No exports were found on the server.</p>
          <p>
            Users can generate export requests on the{" "}
            <Link
              className="text-active underline"
              target="_blank"
              rel="noreferrer"
              to="/jobs"
            >
              Jobs
            </Link>{" "}
            page, and admins can use this page to review, approve, and reject
            them.
          </p>
        </div>
      );
    }
  }

  return (
    <>
      <HeadingOne>Admin View - All Exports</HeadingOne>
      <PageBody />
    </>
  );
}
