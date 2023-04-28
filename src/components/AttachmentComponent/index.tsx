import AttachmentIcon from "../AttachmentIcon";
import {
  formatBytes,
  deleteAttachment,
  getAttachmentName,
} from "../../lib/attachmentUploadHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import { Trash2 } from "react-feather";
import { ExportJob } from "../../types";
import NotificationModal from "../NotificationModal";

type AttachmentComponentProps = {
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
  attachment: fhir4.Attachment;
};

function TrashButton({ deleteThis }: { deleteThis: () => void }) {
  return (
    <button
      type="button"
      title="Delete Attachment"
      className="absolute right-0 top-0 border-b border-l border-dashed p-1"
      onClick={deleteThis}
    >
      <Trash2 aria-hidden="true" size={16} className="text-red-600" />
      <span className="sr-only">Delete Attachment</span>
    </button>
  );
}

export default function AttachmentComponent({
  jobId,
  refreshJob,
  attachment,
}: AttachmentComponentProps) {
  const { setNotification } = useNotificationContext();
  const attachmentFileName = getAttachmentName(attachment);
  const attachmentTitle = attachment.title;

  const deleteThis = () => {
    deleteAttachment(jobId, attachmentFileName)
      .then(() => refreshJob())
      .catch((err) => {
        setNotification({ id: attachmentFileName, message: err.message });
      });
  };
  return (
    <>
      <li className="relative flex w-full items-center rounded border p-4 text-sm">
        <div className="pr-4">
          <AttachmentIcon type={attachment.contentType} />
        </div>
        <div className="flex w-full items-center justify-between">
          <p>{attachmentTitle && attachmentTitle}</p>
          <p className="mr-4">
            {attachment.size && formatBytes(attachment.size)}
          </p>
        </div>
        <TrashButton deleteThis={deleteThis} />
      </li>
      <NotificationModal
        id={attachmentFileName}
        title={`Unable to delete '${attachmentTitle}' with error: `}
        variant="warning"
      />
    </>
  );
}
