import ExportJobListItemAdmin from "../components/exportJobs/ExportJobListItemAdmin";
import { getExportJobs } from "../api/adminApiHandlers";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import HeadingOne from "../components/generic/HeadingOne";
import { Link } from "react-router-dom";
import { usePolling } from "../hooks/usePolling";
import useAsyncJobs from "../hooks/useAsyncJobs";
import useCookie from "../hooks/useCookie";
import { useMemo } from "react";

export default function AdminExportJobList() {
  return (
    <>
      <HeadingOne>Admin View - All Exports</HeadingOne>
      <PageBody />
    </>
  );
}

/**
 * Contains conditional rendering logic, hoisted into its own component inorder
 * to avoid redefining this function every re-render of the overarching list component
 */
function PageBody() {
  const { refreshJobs, loading, jobs, error } = useAsyncJobs(getExportJobs);
  const { cookie: patientCookie } = useCookie("patients");
  const filteredJobs = useMemo(() => {
    if (patientCookie) {
      const activePatientIds = patientCookie.split(",");
      const jobsWithKnownLabels = jobs
        ?.map((job) => {
          if (activePatientIds.indexOf(job.patient.id) !== -1) {
            job.knownPatientId = true;
            return job;
          } else {
            return job;
          }
        })
        .sort((j1, j2) => (j2.knownPatientId ? 1 : -1));
      return jobsWithKnownLabels;
    } else {
      return jobs;
    }
  }, [jobs, patientCookie]);

  // Always check for new jobs regularly
  usePolling(refreshJobs);
  if (loading && jobs === null) {
    return <Loading display={"Loading current export jobs"} />;
  } else if (error) {
    return (
      <ErrorMessage
        error={error}
        display="An error occurred in fetching jobs."
      />
    );
  } else if (filteredJobs && filteredJobs.length > 0) {
    return (
      <ul className="space-y-4">
        {filteredJobs.map((job: EHIApp.ExportJob) => (
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
