import { clipAttachmentName } from "../../lib/attachmentUploadHelpers";
import { LocalAttachment } from "../../types";

type AttachmentComponentProps = {
  attachment: LocalAttachment;
};

export default function AttachmentComponent({
  attachment,
}: AttachmentComponentProps) {
  return (
    <p className="w-full rounded border p-2 text-xs">
      {clipAttachmentName(attachment.name)}
    </p>
  );
}
