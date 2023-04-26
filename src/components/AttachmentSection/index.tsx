import { useState } from "react";
import AttachmentUpload from "../AttachmentUpload";
import AttachmentComponent from "../AttachmentComponent";
import { LocalAttachment } from "../../types";

export default function AttachmentSection() {
  const [attachments, setAttachment] = useState<LocalAttachment[]>([
    { name: "some attachment" },
  ]);
  return (
    <section
      id="attachmentsContainer"
      className="flex flex-col items-center justify-between"
    >
      <div className="h-[50vh] max-h-[50vh] overflow-scroll">
        {attachments.map((attach) => {
          return <AttachmentComponent key={attach.name} attachment={attach} />;
        })}
      </div>
      <AttachmentUpload setAttachment={setAttachment} />
    </section>
  );
}
