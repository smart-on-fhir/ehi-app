import ExportJobStatusIndicatorPatient from "./ExportJobStatusIndicatorPatient";
import ExportJobStatusBlurbPatient from "./ExportJobStatusBlurbPatient";
import ExportJobAction from "./ExportJobAction";
import {
  jobEqualityMemoizer,
  displayApprovedDate,
  displayCreatedDate,
} from "../../lib/jobHelpers";
import React from "react";

type ExportJobListItemPatientProps = {
  job: EHIApp.PatientExportJob;
  refreshJobs: (requestOptions?: RequestInit) => Promise<void>;
};

function ExportJobListItemPatient({
  job,
  refreshJobs,
}: ExportJobListItemPatientProps) {
  // TODO: Get this information off of the job when supported on the job
  const institutionName = "New York Gerontology Hospital";
  const { status, approvedAt } = job;
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-auto flex-shrink-0 flex-col items-center justify-center text-center">
        <ExportJobStatusIndicatorPatient status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurbPatient status={status} />
        </div>
      </div>
      <div className="w-full ">
        <p className="mr-2 inline-flex items-center text-lg font-bold">
          {institutionName}
        </p>
        <p className="text-sm ">{displayCreatedDate(job)}</p>
        {approvedAt !== null && (
          <p className="text-sm ">{displayApprovedDate(job)}</p>
        )}
      </div>
      <ExportJobAction job={job} refreshJobs={refreshJobs} />
    </li>
  );
}

// This list-item should only update if the job has updated
export default React.memo(
  ExportJobListItemPatient,
  jobEqualityMemoizer<EHIApp.PatientExportJob>
);
