import { formatBytes } from "../../lib/attachmentUploadHelpers";

type AttachmentComponentProps = {
  attachment: fhir4.Attachment;
};

export default function AttachmentComponent({
  attachment,
}: AttachmentComponentProps) {
  return (
    <p className="w-full rounded border p-2 text-xs">
      {attachment.size && formatBytes(attachment.size)}
      <br />
      {JSON.stringify(attachment)}
    </p>
  );
}
