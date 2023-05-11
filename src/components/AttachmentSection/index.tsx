import AttachmentUpload from "../AttachmentUpload";
import AttachmentComponent from "../AttachmentComponent";
import { ExportJob } from "../../types";

type AttachmentSectionProps = {
  job: ExportJob;
  disabled?: boolean;
  refreshJob: () => Promise<void>;
};

export default function AttachmentSection({
  job,
  disabled,
  refreshJob,
}: AttachmentSectionProps) {
  const jobId = job.id;
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      <AttachmentUpload jobId={jobId} refreshJob={refreshJob} />
      <ul className="max-h-[calc(100vh-510px)] w-full space-y-2 overflow-scroll sm:max-h-[calc(100vh-470px)]">
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
