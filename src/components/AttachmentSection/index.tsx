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
      <AttachmentUpload setAttachment={setAttachment} />
      <div className="max-h-[60vh] w-full overflow-scroll">
        {attachments.map((attach) => {
          return <AttachmentComponent key={attach.name} attachment={attach} />;
        })}
      </div>
    </section>
  );
}
