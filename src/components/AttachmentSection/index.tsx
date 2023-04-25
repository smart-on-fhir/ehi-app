import { Plus } from "react-feather";
import Button from "../Button";
import { LocalAttachment } from "../../types";

/**
 * Clips attachment names to be 24 chars long, including
 * file extension and ellipsis
 * @param name The attachment name to be clipped
 *
 */
function clipAttachmentName(name: LocalAttachment["name"]) {
  const MAX_LENGTH = 24;
  if (name.length <= MAX_LENGTH) {
    return name;
  } else {
    // QUESTION: will there always be an extension? Not sure about the FileReader API
    const ext = "." + name.split(".").at(-1);
    const ellipsis = "[...]";
    const clippedName = name.slice(
      0,
      MAX_LENGTH - ext!.length - ellipsis.length
    );
    return clippedName + ellipsis + ext;
  }
}

function AttachmentComponent({ attachment }: { attachment: LocalAttachment }) {
  return (
    <p className="w-full rounded border p-2 text-xs">
      {clipAttachmentName(attachment.name)}
    </p>
  );
}

export default function AttachmentSection({
  setAttachment,
  attachments,
}: {
  setAttachment: Function;
  attachments: LocalAttachment[];
}) {
  return (
    <>
      <div className="h-[60vh] max-h-[60vh] overflow-scroll">
        {attachments.map((attach) => {
          return <AttachmentComponent key={attach.name} attachment={attach} />;
        })}
      </div>
      <Button
        className="mb-2 flex w-full justify-center align-baseline"
        variant="secondary"
        onClick={(e) => {
          setAttachment((prevAttachments: LocalAttachment[]) => [
            ...prevAttachments,
            { name: `attachment-${Math.random()}.txt` },
          ]);
        }}
      >
        <Plus className="mr-2" />
        Add Attachment
      </Button>
    </>
  );
}
