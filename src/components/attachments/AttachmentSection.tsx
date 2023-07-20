import AttachmentUpload from "./AttachmentUpload";
import AttachmentComponent from "./AttachmentComponent";

type AttachmentSectionProps = {
  job: EHIApp.ExportJob;
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function AttachmentSection({
  job,
  updateJob,
}: AttachmentSectionProps) {
  const jobId = job.id;
  const jobAttachable = job.status !== "awaiting-input";

  // If admin cannot yet interact with job via attachments, render nothing
  if (!jobAttachable) {
    return null;
  }

  const jobEditable = job.status === "retrieved";
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      {jobEditable && <AttachmentUpload jobId={jobId} updateJob={updateJob} />}
      {job.attachments && job.attachments.length !== 0 && (
        <ul className="w-full space-y-2">
          {job.attachments.map((attachment) => {
            return (
              <AttachmentComponent
                jobEditable={jobEditable}
                key={attachment.url}
                jobId={jobId}
                attachment={attachment}
                updateJob={updateJob}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}
