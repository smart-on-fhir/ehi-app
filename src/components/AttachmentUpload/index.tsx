import { Dispatch, SetStateAction, useState } from "react";
import { LocalAttachment } from "../../types";

type AttachmentUploadProps = {
  setAttachment: Dispatch<SetStateAction<LocalAttachment[]>>;
};

export default function AttachmentUpload({
  setAttachment,
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const supportedFiles = [".json", ".csv"];

  // Load files into memory using promises
  function loadFiles(files: FileList) {
    console.log(files);
    setAttachment((prevAttachments: LocalAttachment[]) => [
      ...prevAttachments,
      { name: `attachment-${Math.random()}.txt` },
    ]);
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFiles(e.dataTransfer.files);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const filesToAdd = event.target.files;
    if (filesToAdd && filesToAdd.length > 0) {
      loadFiles(filesToAdd);
    }
  }
  return (
    <div
      id="file-upload-zone"
      className={`my-2 h-16 w-full rounded-lg border-2 border-slate-600 ${
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
          <span className="text-link font-bold">Browse</span>
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
          //   multiple
        />
      </label>
    </div>
  );
}
