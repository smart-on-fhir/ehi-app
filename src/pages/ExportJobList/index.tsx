import { useEffect, useState } from "react";
import Button from "../../components/Button";
import ExportJobCard from "../../components/ExportJobCard";
import getExportJobs from "../../lib/getExportJobs";
import { ExportJob } from "../../types";

function Loading(): JSX.Element {
  return <h1>Loading Jobs</h1>;
}

function Error({ error }: { error: Error }): JSX.Element {
  return (
    <>
      <h1>An error occurred</h1>
      <p>{JSON.stringify(error)}</p>
    </>
  );
}

export default function ExportJobList() {
  // const SMART = useSMARTContext();
  // NOTE: For demo purposes, this is a fixed string. In practice, there will be
  //       1...* many EHI servers, one for each institution we request from.
  // QUES: Maybe this should reuse the client but assume one is active?
  const [url, setUrl] = useState<string>("http://localhost:49632");
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  function getJobsUpdateState(signal?: AbortSignal) {
    setLoading(true);
    getExportJobs(url, signal)
      .then((response) => {
        console.log(response);
        setError(null);
        setJobs(response);
      })
      .catch((err) => {
        console.log("An error occurred in job-fetching");
        setError(err);
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

  return (
    <>
      <h1>Jobs</h1>
      <div className="space-x-2">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <Button onClick={() => getJobsUpdateState()}>Refresh Jobs</Button>
      </div>
      {(() => {
        if (error) {
          return <Error error={error} />;
        } else if (loading) {
          return <Loading />;
        } else {
          return (
            <ul className="mt-4">
              {jobs.map((job, i) => (
                <ExportJobCard key={job.id} job={job} />
              ))}
            </ul>
          );
        }
      })()}
    </>
  );
}
