import AttachmentIcon from "./AttachmentIcon";
import AttachmentDeleteButton from "./AttachmentDeleteButton";
import {
  formatBytes,
  getAttachmentName,
} from "../../lib/attachmentUploadHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import { deleteAttachment } from "../../api/adminApiHandlers";
import NotificationModal from "../generic/NotificationModal";

type AttachmentComponentProps = {
  jobId: EHIApp.ExportJob["id"];
  jobEditable: boolean;
  refreshJob: () => Promise<void>;
  attachment: fhir4.Attachment;
};

export default function AttachmentComponent({
  jobId,
  jobEditable,
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
        setNotification({
          id: attachmentFileName,
          title: `Unable to delete '${attachmentTitle}' with error: `,
          errorMessage: err.message,
        });
      });
  };
  return (
    <>
      <li className="relative flex w-full items-center rounded-lg border border-gray-300 p-4 text-sm">
        <div className="pr-4">
          <AttachmentIcon type={attachment.contentType} />
        </div>
        <div className="flex w-full items-center justify-between">
          <p className="mr-4 break-all">{attachmentTitle && attachmentTitle}</p>
          <p className="mr-4 whitespace-nowrap">
            {attachment.size && formatBytes(attachment.size)}
          </p>
        </div>
        {/* Absolute positioned into upper-right corner */}
        {jobEditable && (
          <div className="absolute right-0 top-0 flex h-fit border-b border-l border-dashed border-gray-300 p-1">
            <AttachmentDeleteButton onClick={deleteThis} />
          </div>
        )}
      </li>
      <NotificationModal id={attachmentFileName} variant="warning" />
    </>
  );
}
