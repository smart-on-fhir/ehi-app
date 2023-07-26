import React from "react";
import LinkButton from "../generic/LinkButton";
import ExportJobStatusIndicatorAdmin from "./ExportJobStatusIndicatorAdmin";
import ExportJobStatusBlurbAdmin from "./ExportJobStatusBlurbAdmin";
import {
  jobEqualityMemoizer,
  displayCreatedDate,
  displayPatientInformation,
} from "../../lib/jobHelpers";

/**
 * Render a sentence fragment to visually indicate if this is a known patient
 * @param knownPatientId whether or not to display this indicator
 * @returns some stylized text with a leading comma
 */
function KnownPatientIndicator({
  knownPatientId,
}: {
  knownPatientId: boolean | undefined;
}) {
  if (knownPatientId) {
    return (
      <>
        <span className="opacity-50">{", "}</span>
        <span
          className="cursor-default font-bold text-red-600 opacity-100"
          title="This job is associated with a patient used in the patient-facing app."
        >
          Your Patient
        </span>
      </>
    );
  } else {
    return null;
  }
}

function ExportJobListItemAdmin({ job }: { job: EHIApp.ExportJob }) {
  const { id, status, attachments } = job;
  return (
    <li className="relative flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-shrink-0 flex-col items-center text-center">
        <ExportJobStatusIndicatorAdmin status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurbAdmin status={status} />
        </div>
      </div>
      <div className="w-full">
        <h1 className="mr-2 inline-flex items-center text-lg font-bold">
          Job #{id}
        </h1>
        <pre className="whitespace-pre-wrap text-xs italic">
          <p>
            <span className="opacity-50">{displayPatientInformation(job)}</span>
            <KnownPatientIndicator knownPatientId={job.knownPatientId} />
          </p>
          <p className="opacity-50">{displayCreatedDate(job)}</p>
          <p className="opacity-50">{`${attachments.length} Attachments`}</p>
        </pre>
      </div>
      <LinkButton className="w-24" to={`/admin/jobs/${id}`}>
        {status === "retrieved" ? "Review" : "Details"}
      </LinkButton>
    </li>
  );
}

// This list-item should only update if the job has updated
export default React.memo(
  ExportJobListItemAdmin,
  jobEqualityMemoizer<EHIApp.ExportJob>
);
