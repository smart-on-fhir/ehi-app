import { Dispatch, SetStateAction } from "react";
import { Plus } from "react-feather";
import Button from "../Button";
import { LocalAttachment } from "../../types";

type AttachmentUploadProps = {
  setAttachment: Dispatch<SetStateAction<LocalAttachment[]>>;
};

export default function AttachmentUpload({
  setAttachment,
}: AttachmentUploadProps) {
  return (
    <Button
      className="mb-2 flex w-full justify-center align-baseline"
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
  );
}
