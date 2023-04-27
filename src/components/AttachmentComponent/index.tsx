import AttachmentIcon from "../AttachmentIcon";
import {
  formatBytes,
  deleteAttachment,
  getAttachmentName,
} from "../../lib/attachmentUploadHelpers";
import { Trash2 } from "react-feather";
import { ExportJob } from "../../types";

type AttachmentComponentProps = {
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
  attachment: fhir4.Attachment;
};

function TrashButton({ deleteThis }: { deleteThis: () => void }) {
  return (
    <button
      className="absolute right-0 top-0 border-b border-l border-dashed p-1"
      onClick={deleteThis}
    >
      <Trash2 size={16} color="red" />
    </button>
  );
}

export default function AttachmentComponent({
  jobId,
  refreshJob,
  attachment,
}: AttachmentComponentProps) {
  const attachmentFileName = getAttachmentName(attachment);
  const deleteThis = () => {
    console.log(attachmentFileName);
    deleteAttachment(jobId, attachmentFileName).then(() => refreshJob());
  };
  return (
    <li className="relative flex w-full items-center rounded border p-4 text-sm">
      <AttachmentIcon type={attachment.contentType} />
      <div className="flex w-full items-center justify-between">
        <p>{attachment.title && attachment.title}</p>
        <p className="mr-4">
          {attachment.size && formatBytes(attachment.size)}
        </p>
      </div>
      <TrashButton deleteThis={deleteThis} />
    </li>
  );
}
