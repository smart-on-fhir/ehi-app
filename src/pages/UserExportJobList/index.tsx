import { useCallback } from "react";
import { useAsync } from "../../hooks/useAsync";
import ExportJobListItemUser from "../../components/ExportJobListItemUser";
import LinkButton from "../../components/LinkButton";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import HeadingOne from "../../components/HeadingOne";
import { ExportJobSummary } from "../../types";
import { getExportJobs } from "../../lib/exportJobHelpers";
import { Plus } from "react-feather";
import "./index.css";

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
          display="There was an error loading health record requests."
        />
      );
    } else if (jobs) {
      return (
        <ul className="max-h-[calc(100vh-210px)] min-h-[375px] space-y-4 overflow-y-auto sm:max-h-[calc(100vh-170px)]">
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
