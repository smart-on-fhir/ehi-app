import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import ExportJobListItemSmall from "../ExportJobListItemSmall";
import LinkButton from "../../components/LinkButton";
import { ExportJobSummary } from "../../types";
import { getExportJobs } from "../../lib/exportJobHelpers";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import HeadingOne from "../HeadingOne";
import { Plus } from "react-feather";

export default function UserExportJobList() {
  const {
    loading,
    result: jobs,
    error,
  } = useAsync<ExportJobSummary[]>(useCallback(getExportJobs, []), true);
  function PageBody() {
    if (loading) {
      return <Loading display="Loading health record requests..." />;
    } else if (error) {
      return (
        <ErrorMessage
          error={error}
          display="There was an error loading health record requests"
        />
      );
    } else if (jobs) {
      return (
        <ul className="h-[calc(100vh-210px)] space-y-6 overflow-y-scroll sm:h-[calc(100vh-170px)]">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => <ExportJobListItemSmall key={job.id} job={job} />)
          ) : (
            <p>No jobs were found on the server</p>
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
        <HeadingOne>Active EHI Exports</HeadingOne>
        <LinkButton className="flex items-baseline " to="/institutionSelection">
          <Plus size={12} className="mr-2 inline" />
          New Export
        </LinkButton>
      </div>
      <PageBody />
    </>
  );
}
