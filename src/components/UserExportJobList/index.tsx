import { useEffect, useState } from "react";
import ExportJobListItemSmall from "../ExportJobListItemSmall";
import LinkButton from "../../components/LinkButton";
import { ExportJobSummary } from "../../types";
import { getExportJobs } from "../../lib/exportJobHelpers";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";
import HeadingOne from "../HeadingOne";
import { Plus } from "react-feather";

export default function UserExportJobList() {
  const [jobs, setJobs] = useState<ExportJobSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  function getJobsUpdateState(signal?: AbortSignal) {
    setLoading(true);
    getExportJobs(signal)
      .then((response) => {
        setError(null);
        setJobs(response);
      })
      .catch((err) => {
        // If it was a non-abort error, we should track it
        if (err.name !== "AbortError") {
          console.log("An error occurred in job-fetching");
          setError(err);
        }
      })
      // Always set loading to false when the requests are complete
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    // Abort controller let's us abort requests on unmount
    const abortController = new AbortController();
    const signal = abortController.signal;
    getJobsUpdateState(signal);
    return () => {
      abortController.abort();
    };
  }, []);
  if (loading) {
    return <Loading display="Loading health record requests" />;
  } else if (error) {
    return (
      <ErrorMessage
        error={error}
        display="There was an error loading health record requests"
      />
    );
  } else {
    return (
      <>
        <div className="flex items-baseline justify-between">
          <HeadingOne>Active EHI Exports</HeadingOne>
          <LinkButton
            className="flex items-baseline "
            to="/institutionSelection"
          >
            <Plus size={12} className="mr-2 inline" />
            New Export
          </LinkButton>
        </div>
        <ul className="h-[calc(100vh-210px)] space-y-6 overflow-y-scroll sm:h-[calc(100vh-170px)]">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => <ExportJobListItemSmall key={job.id} job={job} />)
          ) : (
            <p>No jobs were found on the server</p>
          )}
        </ul>
      </>
    );
  }
}
