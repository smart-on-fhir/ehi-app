import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import ExportJobListItemLarge from "../../components/ExportJobListItemLarge";
import { getExportJobs } from "../../lib/exportJobHelpers";
import { ExportJobSummary } from "../../types";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import HeadingOne from "../../components/HeadingOne";
import { Link } from "react-router-dom";

export default function ExportJobList() {
  const {
    loading,
    result: jobs,
    error,
  } = useAsync<ExportJobSummary[]>(useCallback(getExportJobs, []), true);

  function PageBody() {
    if (loading) {
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
        <ul className="max-h-[calc(100vh-210px)] space-y-4 overflow-y-scroll sm:max-h-[calc(100vh-170px)]">
          {jobs.map((job, i) => (
            <ExportJobListItemLarge key={job.id} job={job} />
          ))}
        </ul>
      );
    } else {
      return (
        <p>
          No exports were found on the server. Create an export by navigating to
          the general{" "}
          <Link className="underline" to="/jobs">
            Jobs
          </Link>{" "}
          page.
        </p>
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
