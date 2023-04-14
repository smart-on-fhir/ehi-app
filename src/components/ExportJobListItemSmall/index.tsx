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
  const url = `${process!.env!.REACT_APP_EHI_SERVER}/fhir`;
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
      ? `${process!.env!.REACT_APP_EHI_SERVER}/jobs/${
          job.id
        }/customize?_patient=${job.patientId}`
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
