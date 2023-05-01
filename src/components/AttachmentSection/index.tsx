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
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      <AttachmentUpload jobId={jobId} refreshJob={refreshJob} />
      <ul className="max-h-[60vh] w-full space-y-2 overflow-scroll">
        {job.attachments.map((attachment) => {
          return (
            <AttachmentComponent
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
