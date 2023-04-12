import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { ExportJob } from "../../types";
import getExportJobs from "../../lib/getExportJobs";
import Loading from "../Loading";
import ErrorMessage from "../ErrorMessage";

export default function UserExportJobList() {
  const navigate = useNavigate();
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
  if (loading) {
    return <Loading display="Loading active health-record requests" />;
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
        <div className="mb-4 border">
          <h1 className="border-b px-4 py-2">My Health Records</h1>
          <ul className="px-4 py-2">
            {jobs &&
              jobs.map((job) => {
                return <li>{JSON.stringify(job)}</li>;
              })}
          </ul>
          <Button
            className="m-4"
            onClick={() => navigate("/institutionSelection")}
          >
            Add Record
          </Button>
        </div>
      </>
    );
  }
}
