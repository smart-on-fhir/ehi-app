import { findMatchingInstitution } from "../../lib/institutionHelpers";
import { ExportJobSummary } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobStatusBlurb from "../ExportJobStatusBlurb";
import ExportJobAction from "../ExportJobAction";

type ExportJobListItemUserProps = {
  job: ExportJobSummary;
};

export default function ExportJobListItemUser({
  job,
}: ExportJobListItemUserProps) {
  // NOTE: In a world where the export-jobs from multiple institutions are being listed in the same place,
  //       this would be odd. Should be fine for demo purposes.
  const url = `${process!.env!.REACT_APP_EHI_SERVER}/fhir`;
  const institutionName = findMatchingInstitution(url)?.displayName;
  const { status, createdAt, completedAt } = job;
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-auto flex-shrink-0 flex-col items-center justify-center text-center">
        <ExportJobStatusIndicator status={status} />
        <div className="text-xs opacity-80">
          <ExportJobStatusBlurb status={status} />
        </div>
      </div>
      <div className="w-full">
        <p className="font-bold">{institutionName}</p>
        <p className="italics text-sm italic ">
          {completedAt === 0
            ? `Created ${new Date(createdAt).toLocaleString()}`
            : `Completed ${new Date(completedAt).toLocaleString()}`}
        </p>
      </div>
      <ExportJobAction job={job} status={status} />
    </li>
  );
}
