import { findMatchingInstitution } from "../../lib/institutionHelpers";
import { ExportJobSummary } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobStatusBlurb from "../ExportJobStatusBlurb";

type ExportJobListItemSmallProps = {
  job: ExportJobSummary;
};

export default function ExportJobListItemSmall({
  job,
}: ExportJobListItemSmallProps) {
  // NOTE: In a world where the export-jobs from multiple institutions are being listed in the same place,
  //       this would be odd. Should be fine for demo purposes.
  const url = `${process!.env!.REACT_APP_EHI_SERVER}/fhir`;
  const institutionName = findMatchingInstitution(url)?.displayName;
  const status = job.status;
  return (
    <li className="rounded border bg-white p-4">
      <p className="font-bold">{institutionName}</p>
      <div className="flex items-center">
        <ExportJobStatusIndicator status={status} size={16} />
        <ExportJobStatusBlurb job={job} status={status} />
      </div>
    </li>
  );
}
