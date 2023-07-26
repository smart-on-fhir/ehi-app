import ExportJobListItemPatient from "../components/exportJobs/ExportJobListItemPatient";
import LinkButton from "../components/generic/LinkButton";
import Loading from "../components/generic/Loading";
import ErrorMessage from "../components/generic/ErrorMessage";
import HeadingOne from "../components/generic/HeadingOne";
import { Plus } from "react-feather";
import { usePolling } from "../hooks/usePolling";
import { getExportJobs } from "../api/patientApiHandlers";
import useAsyncJobs from "../hooks/useAsyncJobs";
// import useCookie from "../hooks/useCookie";
// import { useMemo } from "react";

export default function PatientExportJobList() {
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

/**
 * Contains conditional rendering logic, cleaved into its own component in order
 * to avoid redefining this function every re-render of the overarching list component
 */
function PageBody() {
  const { refreshJobs, loading, jobs, error } =
    useAsyncJobs<EHIApp.PatientExportJob[]>(getExportJobs);

  // TODO: Reevaluate this filtering
  // const { cookie: patientCookie } = useCookie("patients");
  // // Patient-users should only see jobs associated with the patient id they've selected;
  // // filter all others out. This value should update when jobs or our cookie change
  // const filteredJobs: EHIApp.PatientExportJob[] | null = useMemo(() => {
  //   if (patientCookie && jobs) {
  //     const activePatientIds = patientCookie.split(",");
  //     return jobs.filter(
  //       (job) => activePatientIds.indexOf(job.patient.id) !== -1
  //     );
  //   } else {
  //     return [];
  //   }
  // }, [jobs, patientCookie]);

  // Always check for new jobs regularly
  usePolling(refreshJobs);
  // If there's an awaiting-input job, check more regularly
  usePolling(
    refreshJobs,
    500,
    () => jobs?.some((job) => job.status === "awaiting-input") || false
  );

  if (loading && jobs === null) {
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
      <ul className="space-y-4">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
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
