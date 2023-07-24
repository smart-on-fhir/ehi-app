import ExportJobListItemPatient from "../components/exportJobs/ExportJobListItemPatient";
import LinkButton from "../components/generic/LinkButton";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import HeadingOne from "../components/generic/HeadingOne";
import { Plus } from "react-feather";
import { usePolling } from "../hooks/usePolling";
import { getExportJobs } from "../api/patientApiHandlers";
import useAsyncJobs from "../hooks/useAsyncJobs";
import useCookie from "../hooks/useCookie";
import { useMemo } from "react";

export default function PatientExportJobList() {
  const { refreshJobs, loading, jobs, error } =
    useAsyncJobs<EHIApp.PatientExportJob[]>(getExportJobs);
  const { cookie: patientCookie } = useCookie("patients");

  const filteredJobs: EHIApp.PatientExportJob[] | null = useMemo(() => {
    if (patientCookie && jobs) {
      const activePatientIds = patientCookie.split(",");
      return jobs.filter(
        (job) => activePatientIds.indexOf(job.patient.id) !== -1
      );
    } else {
      return [];
    }
  }, [jobs, patientCookie]);

  // Always check for new jobs regularly
  usePolling(refreshJobs);
  // If there's an awaiting-input job, check more regularly
  usePolling(
    refreshJobs,
    500,
    () => filteredJobs?.some((job) => job.status === "awaiting-input") || false
  );

  function PageBody() {
    if (loading && filteredJobs === null) {
      return <Loading display="Loading health record requests..." />;
    } else if (error) {
      return (
        <ErrorMessage
          error={error}
          display="There was an error loading health record requests."
        />
      );
    } else if (filteredJobs) {
      return (
        <ul className="space-y-4">
          {filteredJobs && filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <ExportJobListItemPatient
                key={job.id}
                job={job}
                refreshJobs={refreshJobs}
              />
            ))
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
