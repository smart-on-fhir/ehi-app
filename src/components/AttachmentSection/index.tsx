import AttachmentUpload from "../AttachmentUpload";
import AttachmentComponent from "../AttachmentComponent";
import { ExportJob } from "../../types";

type AttachmentSectionProps = {
  job: ExportJob;
  refreshJob: () => Promise<void>;
};

export default function AttachmentSection({
  job,
  refreshJob,
}: AttachmentSectionProps) {
  const jobId = job.id;
  const jobAttachable = job.status !== "awaiting-input";

  // If admin cannot yet interact with job via attachments, render nothing
  if (!jobAttachable) {
    return null;
  }

  const jobEditable = job.status === "in-review";
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      {jobEditable && (
        <AttachmentUpload jobId={jobId} refreshJob={refreshJob} />
      )}
      <ul className="max-h-[calc(100vh-510px)] w-full space-y-2 overflow-scroll sm:max-h-[calc(100vh-470px)]">
        {job.attachments.map((attachment) => {
          return (
            <AttachmentComponent
              jobEditable={jobEditable}
              key={attachment.url}
              jobId={jobId}
              attachment={attachment}
              refreshJob={refreshJob}
            />
          );
        })}
      </ul>
    </section>
  );
}
