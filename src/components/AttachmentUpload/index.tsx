import { useState } from "react";
import {
  uploadAttachments,
  formatBytes,
  supportedFiles,
  MAX_FILE_NUM,
  MAX_FILE_SIZE,
} from "../../lib/attachmentUploadHelpers";
import { ExportJob } from "../../types";

const SUPPORTED_FILES_TEXT =
  "Supports CSV, JSON, excel, and most image/document file formats";
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
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
};

const SUPPORTED_FILES_TEXT = `Supports CSV, JSON, excel, and most image/document file formats\nUpload up to ${MAX_FILE_NUM} different, ${formatBytes(
  MAX_FILE_SIZE
)} files at a time`;

export default function AttachmentUpload({
  jobId,
  refreshJob,
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  function loadAttachments(attachmentList: FileList) {
    uploadAttachments(jobId, attachmentList).then(() => refreshJob());
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
      loadAttachments(e.dataTransfer.files);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const filesToAdd = event.target.files;
    if (filesToAdd && filesToAdd.length > 0) {
      loadAttachments(filesToAdd);
    }
  }
  return (
    <div
      id="file-upload-zone"
      className={`mb-4 h-20 w-full rounded-lg border-2 border-slate-600 ${
        dragActive ? "border-solid bg-slate-400" : "border-dashed bg-slate-200"
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
    </div>
  );
}
