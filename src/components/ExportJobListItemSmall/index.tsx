import { EHI_SERVER_FHIR_URL, EHI_SERVER_BASE_URL } from "../../lib/constants";
import { findMatchingInstitution } from "../../lib/institutionHelpers";
import { ExportJobSummary, ExportJobStatus } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";

type ExportJobListItemSmallProps = {
  job: ExportJobSummary;
};
type ExportJobBlurbProps = {
  status: ExportJobStatus;
  link: string | null;
  createdDate: Date | null;
};

function ExportJobBlurb({ status, link, createdDate }: ExportJobBlurbProps) {
  if (status === "awaiting-input") {
    return link ? (
      <a href={link} className="ml-2 italic text-blue-600 underline">
        Awaiting Information
      </a>
    ) : null;
  } else {
    return (
      <p className="ml-2">{`Created ${
        createdDate ? createdDate.toDateString() : "time unknown"
      }`}</p>
    );
  }
}

export default function ExportJobListItemSmall({
  job,
}: ExportJobListItemSmallProps) {
  // NOTE: In a world where the export-jobs from multiple institutions are being listed in the same place,
  //       this would be odd. Should be fine for demo purposes.
  const url = EHI_SERVER_FHIR_URL;
  const institutionName = findMatchingInstitution(url)?.displayName;
  // NOTE: LEFT IN FOR TESTING; SHOULD REMOVE AFTER TESTING THE LOOK OF ALL STATUS INDICATORS
  // const statusArr: ExportJobStatus[] = [
  //   "awaiting-input",
  //   "in-review",
  //   "requested",
  //   "retrieved",
  //   "aborted",
  //   "rejected",
  // ];
  // const status = statusArr[Math.round(Math.random() * 5)];
  const status = job.status;
  // NOTE: Should this field change depending on status? Mockups suggest multiple dates on the ExportJob
  const createdDate = job.createdAt ? new Date(job.createdAt) : null;
  const link =
    status === "awaiting-input"
      ? `${EHI_SERVER_BASE_URL}/jobs/${job.id}/customize`
      : null;

  return (
    <li>
      <p className="font-bold">{institutionName}</p>
      <div className="flex items-center">
        <ExportJobStatusIndicator status={status} size={16} />
        <ExportJobBlurb status={status} link={link} createdDate={createdDate} />
      </div>
    </li>
  );
}
