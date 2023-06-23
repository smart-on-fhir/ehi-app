import ExportJobStatusIndicator from "./ExportJobStatusIndicator";
import ExportJobStatusBlurb from "./ExportJobStatusBlurb";
import ExportJobAction from "./ExportJobAction";

type ExportJobListItemUserProps = {
  job: EHIApp.ExportJob;
};

export default function ExportJobListItemUser({
  job,
}: ExportJobListItemUserProps) {
  // TODO: Get this information off of the job when supported on the job
  const institutionName = "New York Gerontology Hospital";
  const { status, createdAt, approvedAt } = job;
  console.log(job);
  return (
    <li className="flex items-center space-x-4 rounded border bg-white p-4">
      <div className="flex w-20 flex-auto flex-shrink-0 flex-col items-center justify-center text-center">
        <ExportJobStatusIndicator status={status} />
        <div className="text-sm opacity-80">
          <ExportJobStatusBlurb status={status} />
        </div>
      </div>
      <div className="w-full ">
        <p className="mr-2 inline-flex items-center text-lg font-bold">
          {institutionName}
        </p>
        <p className="text-sm ">
          {`Created ${new Date(createdAt).toLocaleString()}`}
        </p>
        <p className="text-sm ">
          {approvedAt !== null &&
            `Completed ${new Date(approvedAt).toLocaleString()}`}
        </p>
      </div>
      <ExportJobAction job={job} status={status} />
    </li>
  );
}
