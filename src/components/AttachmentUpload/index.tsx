import { useState } from "react";
import {
  uploadAttachments,
  supportedFiles,
} from "../../lib/attachmentUploadHelpers";
import { ExportJob } from "../../types";

type AttachmentUploadProps = {
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
};

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
      className={`mb-4 h-16 w-full rounded-lg border-2 border-slate-600 ${
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
        <p className="text-sm italic text-gray-600">
          Supports {supportedFiles.join(", ")}
        </p>
        <input
          onChange={handleChange}
          className="hidden"
          id="attachment-input"
          type="file"
          accept={supportedFiles.join(",")}
          multiple
        />
      </label>
    </div>
  );
}
