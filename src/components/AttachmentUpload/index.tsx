import { useState } from "react";
import {
  uploadAttachments,
  formatBytes,
  MAX_FILE_NUM,
  MAX_FILE_SIZE,
} from "../../lib/attachmentUploadHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import { ExportJob } from "../../types";
import NotificationModal from "../NotificationModal";

const SUPPORTED_FILES = [
  // Data Files
  ".json",
  ".jsonld",
  ".xls",
  ".xlsx",
  ".csv",
  // Image Files
  "image/*",
  ".pdf",
  // Documents
  ".txt",
  ".md",
  ".doc",
  ".xml",
  ".docx",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const SUPPORTED_FILES_TEXT = `Supports CSV, JSON, excel, and most image/document file formats\nUpload up to ${MAX_FILE_NUM} different, ${formatBytes(
  MAX_FILE_SIZE
)} files at a time`;

type AttachmentUploadProps = {
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
};

export default function AttachmentUpload({
  jobId,
  refreshJob,
}: AttachmentUploadProps) {
  const { setNotification } = useNotificationContext();
  const [dragActive, setDragActive] = useState(false);
  const notificationId = "attachment-upload";

  function handleAttachments(attachmentList: FileList) {
    uploadAttachments(jobId, attachmentList)
      .then(() => refreshJob())
      .catch((err) => {
        setNotification({
          id: notificationId,
          title: `There was an error uploading attachments:`,
          errorMessage: err.message,
        });
      });
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    // Needed to prevent opening of dropped file
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    // Needed to prevent opening of dropped file
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAttachments(e.dataTransfer.files);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const filesToAdd = event.target.files;
    if (filesToAdd && filesToAdd.length > 0) {
      handleAttachments(filesToAdd);
    }
  }
  return (
    <div
      id="file-upload-zone"
      className={`mb-4 h-20 w-full rounded-lg border-2 border-primary-600 hover:border-solid hover:bg-primary-200 ${
        dragActive
          ? "border-solid bg-primary-200"
          : "border-dashed bg-primary-50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label
        htmlFor="attachment-input"
        className="flex h-full cursor-pointer flex-col items-center justify-center"
      >
        <p>
          Drag and drop attachments, or click to{" "}
          <span className="text-link font-bold">Attach</span>
        </p>
        <p className="whitespace-pre text-center text-sm italic text-gray-600">
          {SUPPORTED_FILES_TEXT}
        </p>
        <input
          onChange={handleChange}
          className="hidden"
          id="attachment-input"
          type="file"
          accept={SUPPORTED_FILES.join(",")}
          multiple
        />
      </label>
      <NotificationModal id={notificationId} variant="warning" />
    </div>
  );
}
