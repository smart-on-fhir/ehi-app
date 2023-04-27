import AttachmentIcon from "../AttachmentIcon";
import {
  formatBytes,
  deleteAttachment,
  getAttachmentName,
} from "../../lib/attachmentUploadHelpers";
import { Trash2, X } from "react-feather";
import { createPortal } from "react-dom";

import { ExportJob } from "../../types";
import { useEffect, useState } from "react";

type AttachmentComponentProps = {
  jobId: ExportJob["id"];
  refreshJob: () => Promise<void>;
  attachment: fhir4.Attachment;
};

function ModalContent({
  onClose,
  modalContent,
}: {
  onClose: React.MouseEventHandler;
  modalContent: Error["message"];
}): JSX.Element {
  return (
    <div className=" absolute bottom-0 right-0 m-4 max-w-sm rounded border bg-yellow-100 p-4 pr-8 text-sm">
      <p>Unable to delete attachment. Received the following error message: </p>
      <pre className="whitespace-pre-wrap">{modalContent}</pre>
      <button
        className="absolute right-0 top-0 border-b border-l  border-dashed p-1"
        onClick={onClose}
      >
        <X size={12} aria-label="Close" />
        <span className="sr-only">Close notification</span>
      </button>
    </div>
  );
}

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
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modalContent) {
      timeout = setTimeout(() => setModalContent(null), 4000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [modalContent, setModalContent]);

  const attachmentFileName = getAttachmentName(attachment);
  const deleteThis = () => {
    deleteAttachment(jobId, attachmentFileName)
      .then(() => refreshJob())
      .catch((err) => {
        setModalContent(err.message);
      });
  };
  return (
    <>
      <li className="relative flex w-full items-center rounded border p-4 text-sm">
        <div className="pr-4">
          <AttachmentIcon type={attachment.contentType} />
        </div>
        <div className="flex w-full items-center justify-between">
          <p>{attachment.title && attachment.title}</p>
          <p className="mr-4">
            {attachment.size && formatBytes(attachment.size)}
          </p>
        </div>
        <TrashButton deleteThis={deleteThis} />
      </li>
      {modalContent &&
        createPortal(
          <ModalContent
            onClose={() => setModalContent(null)}
            modalContent={modalContent}
          />,
          document.body
        )}
    </>
  );
}
