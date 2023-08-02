import ExportJobStatusIndicatorAdmin from "./ExportJobStatusIndicatorAdmin";
import ExportJobStatusBlurbAdmin from "./ExportJobStatusBlurbAdmin";
import ExportJobParametersAuthorizations from "./ExportJobParametersAuthorizations";
import ExportApproveButton from "./ExportApproveButton";
import ExportRejectButton from "./ExportRejectButton";
import AttachmentSection from "../attachments/AttachmentSection";
import {
  displayCreatedDate,
  displayPatientInformation,
} from "../../lib/jobHelpers";
import KnownPatientIndicator from "./ExportJobKnownPatientIndicator";
import useCookie from "../../hooks/useCookie";

type ExportJobDetailViewProps = {
  job: EHIApp.ExportJob;
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function ExportJobDetailView({
  job,
  updateJob,
}: ExportJobDetailViewProps) {
  const { id, status, attachments } = job;

  // Determine if the patient id associated with this job is in our patients cookie
  const { cookie: patientCookie } = useCookie("patients");
  const knownPatientId =
    patientCookie
      .split(",")
      .findIndex((patientId) => patientId === job.patient.id) !== -1;
  return (
    <section className="space-y-4 rounded border bg-white p-4">
      <header className="flex items-center">
        <div className="flex w-24 flex-col items-center pr-2 text-center">
          <ExportJobStatusIndicatorAdmin status={status} />
          <div className="text-sm opacity-80">
            <ExportJobStatusBlurbAdmin status={status} />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="mr-2 inline-block text-lg font-bold">Job #{id}</h1>
            <pre className="whitespace-pre-wrap text-xs italic">
              <p>
                <span className="opacity-50">
                  {displayPatientInformation(job)}
                </span>
                <KnownPatientIndicator knownPatientId={knownPatientId} />
              </p>
              <p className="opacity-50">{displayCreatedDate(job)}</p>
              <p className="opacity-50">{`${attachments.length} Attachments`}</p>
            </pre>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap justify-end space-x-0 space-y-2 sm:flex-nowrap sm:justify-normal sm:space-x-2 sm:space-y-0">
          <ExportRejectButton job={job} updateJob={updateJob} />
          <ExportApproveButton job={job} updateJob={updateJob} />
        </div>
      </header>
      <ExportJobParametersAuthorizations job={job} />
      <AttachmentSection job={job} updateJob={updateJob} />
    </section>
  );
}
