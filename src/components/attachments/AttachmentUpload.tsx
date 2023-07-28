import { useRef, useState } from "react";
import { SUPPORTED_FILES_TEXT } from "../../lib/attachmentUploadHelpers";
import { useNotificationContext } from "../../context/notificationContext";
import { uploadAttachments } from "../../api/adminApiHandlers";

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

type AttachmentUploadProps = {
  jobId: EHIApp.ExportJob["id"];
  updateJob: (newJob: EHIApp.ExportJob) => void;
};

export default function AttachmentUpload({
  jobId,
  updateJob,
}: AttachmentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Process interactions with the file input element
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const filesToAdd = event.target.files;
    if (filesToAdd && filesToAdd.length > 0) {
      handleAttachments(filesToAdd);
    }
  }

  // Proxy keyboard interactions with our label to trigger click events on our input element
  function handleLabelKeyDown(e: React.KeyboardEvent<HTMLLabelElement>): void {
    // Trigger the fileInput click process if we are processing an enter or a space click
    if (fileInputRef.current !== null && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      fileInputRef.current.click();
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
        tabIndex={0}
        onKeyDown={handleLabelKeyDown}
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
          ref={fileInputRef}
          accept={SUPPORTED_FILES.join(",")}
          multiple
        />
      </label>
    </div>
  );
}
