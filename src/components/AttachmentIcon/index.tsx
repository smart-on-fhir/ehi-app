import { Image, File } from "react-feather";

type AttachmentIconProps = {
  type: fhir4.Attachment["contentType"];
};

function getIcon(type: AttachmentIconProps["type"]) {
  switch (type) {
    case "image/png":
      return <Image />;
    default:
      return <File />;
  }
}

export default function AttachmentIcon({ type }: AttachmentIconProps) {
  return <div className="w-12">{getIcon(type)}</div>;
}
