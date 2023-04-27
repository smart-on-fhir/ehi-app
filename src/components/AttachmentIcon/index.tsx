import { Image, File, Table, FileText, Film } from "react-feather";

type AttachmentIconProps = {
  type: fhir4.Attachment["contentType"];
};

function getIcon(type: AttachmentIconProps["type"]) {
  switch (type) {
    case "text/csv":
    case "application/json":
    case "application/ld+json":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
      return <Table />;
    case "image/svg+xml":
    case "image/jpeg":
    case "image/png":
    case "image/*":
      return <Image />;
    case "image/gif":
    case "video/mp4":
    case "video/mpeg":
      return <Film />;
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
    case "application/pdf":
    case "text/plain":
      return <FileText />;
    default:
      return <File />;
  }
}

export default function AttachmentIcon({ type }: AttachmentIconProps) {
  return <div className="w-12">{getIcon(type)}</div>;
}
