import { Trash2 } from "react-feather";

export default function AttachmentDeleteButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button type="button" title="Delete Attachment" onClick={onClick}>
      <Trash2 aria-hidden="true" size={16} className="text-red-600" />
      <span className="sr-only">Delete Attachment</span>
    </button>
  );
}
