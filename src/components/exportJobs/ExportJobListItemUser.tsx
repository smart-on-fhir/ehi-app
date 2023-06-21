import ExportJobStatusIndicator from "./ExportJobStatusIndicator";
import ExportJobStatusBlurb from "./ExportJobStatusBlurb";
import ExportJobAction from "./ExportJobAction";

type ExportJobListItemUserProps = {
  job: EHIApp.ExportJobSummary;
};

export default function ExportJobListItemUser({
  job,
}: ExportJobListItemUserProps) {
  // TODO: Get this information off of the job when supported on the job
  const institutionName = "New York Gerontology Hospital";
  const { status, createdAt, completedAt } = job;
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-auto flex-shrink-0 flex-col items-center justify-center text-center">
        <ExportJobStatusIndicator status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurb status={status} />
        </div>
      </div>
      <div className="w-full ">
        <p className="text-lg font-bold">{institutionName}</p>
        <p className="text-sm ">
          {completedAt === 0
            ? `Created ${new Date(createdAt).toLocaleString()}`
            : `Completed ${new Date(completedAt).toLocaleString()}`}
        </p>
      </div>
      <ExportJobAction job={job} status={status} />
    </li>
  );
}
