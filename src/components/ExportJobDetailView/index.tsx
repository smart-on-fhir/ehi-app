import ExportJobStatusIndicator from "../ExportJobStatusIndicator";
import ExportJobParametersAuthorizations from "../ExportJobParametersAuthorizations";
import ExportApproveButton from "../ExportApproveButton";
import ExportRejectButton from "../ExportRejectButton";
import AttachmentSection from "../AttachmentSection";
import { ExportJob } from "../../types";

type ExportJobDetailViewProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function ExportJobDetailView({
  job,
  refreshJob,
}: ExportJobDetailViewProps) {
  return (
    <section className="max-h-[90vh] rounded border bg-white p-4">
      <header className="mb-4 flex items-center">
        <div className="flex w-24 flex-col items-center text-center">
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
        <div className="flex space-x-2">
          <ExportRejectButton job={job} refreshJob={refreshJob} />
          <ExportApproveButton job={job} refreshJob={refreshJob} />
        </div>
      </header>
      <div className="space-y-4">
        <ExportJobParametersAuthorizations job={job} />
        <AttachmentSection job={job} refreshJob={refreshJob} />
      </div>
    </section>
  );
}
