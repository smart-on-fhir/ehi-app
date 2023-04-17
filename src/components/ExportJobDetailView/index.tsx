import { ExportJob } from "../../types";
import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import LinkButton from "../LinkButton";
import ExportJobParameters from "../ExportJobParameters";
import ExportJobAuthorizations from "../ExportJobAuthorizations";

type ExportJobDetailViewProps = {
  job: ExportJob;
};

export default function ExportJobDetailView({ job }: ExportJobDetailViewProps) {
  return (
    <article className="max-h-[80vh] overflow-y-scroll rounded border p-4">
      <header className="flex">
        <div className="flex flex-col items-center text-center">
          <ExportJobStatusIndicator status={job.status} />
          <p className="text-xs">{job.status.split("-").join(" ")}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Job #{job.id}</h1>
            <pre className="whitespace-pre-wrap text-xs italic opacity-50">
              {[
                `Patient ${job.patientId}`,
                `Created ${new Date(job.createdAt).toLocaleString()}`,
                `${job.attachments.length} Attachments`,
              ].join("\n")}
            </pre>
          </div>
        </div>
      </header>
      <main>
        <ExportJobParameters parameters={job?.parameters} />
        <ExportJobAuthorizations authorizations={job?.authorizations} />
      </main>
    </article>
  );
}
