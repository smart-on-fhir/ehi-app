import { useEffect, useState } from "react";
import ExportJobListItemLarge from "../../components/ExportJobListItemLarge";
import getExportJobs from "../../lib/getExportJobs";
import { ExportJob } from "../../types";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

export default function ExportJobList() {
  // NOTE: For demo purposes, this is a fixed string. In practice, there will be
  //       1...* many EHI servers, one for each institution we request from.
  // QUES: Maybe this should reuse the client but assume one is active?
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  function getJobsUpdateState(signal?: AbortSignal) {
    setLoading(true);
    getExportJobs(signal)
      .then((response) => {
        console.log(response);
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

  function PageBody() {
    if (loading) {
      return <Loading display={"Loading current export jobs"} />;
    } else if (error) {
      return (
        <ErrorMessage
          error={error}
          display="An error occurred in fetching jobs"
        />
      );
    } else {
      return (
        <ul className="mt-4">
          {jobs.map((job, i) => (
            <ExportJobListItemLarge key={job.id} job={job} />
          ))}
        </ul>
      );
    }
  }

  return (
    <>
      <h1>Jobs</h1>
      <PageBody />
    </>
  );
}