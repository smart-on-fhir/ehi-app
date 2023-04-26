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
  console.log(job.attachments);
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      <AttachmentUpload jobId={job.id} refreshJob={refreshJob} />
      <div className="max-h-[60vh] w-full overflow-scroll">
        {job.attachments.map((attach) => {
          return <AttachmentComponent key={attach.url} attachment={attach} />;
        })}
      </div>
    </section>
  );
}
