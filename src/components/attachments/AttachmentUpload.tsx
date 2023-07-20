import { useState } from "react";
import { formatBytes, MAX_FILE_SIZE } from "../../lib/attachmentUploadHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import { MAX_FILE_NUM, uploadAttachments } from "../../api/adminApiHandlers";

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
const SUPPORTED_FILES_TEXT = `Supports CSV, JSON, excel, and most image/document file formats. Upload up to ${formatBytes(
  MAX_FILE_SIZE
)} total across ${MAX_FILE_NUM} different files at a time.`;

type AttachmentUploadProps = {
  jobId: EHIApp.ExportJob["id"];
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function AttachmentUpload({
  jobId,
  updateJob,
}: AttachmentUploadProps) {
  const { createNotification } = useNotificationContext();
  const [dragActive, setDragActive] = useState(false);

  function handleAttachments(attachmentList: FileList) {
    uploadAttachments(jobId, attachmentList)
      .then((job) => updateJob(job))
      .catch((err) => {
        createNotification({
          title: `There was an error uploading attachments:`,
          errorMessage: err.message,
          variant: "warning",
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
      className={`min-h-20 mb-4 w-full rounded border-2 border-active transition-all hover:border-solid hover:bg-primary-100 hover:shadow-lg ${
        dragActive
          ? "border-solid bg-primary-200 shadow-lg"
          : "border-dashed bg-primary-50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label
        htmlFor="attachment-input"
        className="flex h-full cursor-pointer flex-col items-center justify-center p-2 text-center"
      >
        <p>
          Drag and drop attachments, or click to{" "}
          <span className="text-link font-bold">Attach</span>
        </p>
        <p className="max-w-md whitespace-pre-wrap text-sm italic text-gray-600">
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
    </div>
  );
}
