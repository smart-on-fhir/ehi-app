export const MAX_FILE_SIZE = 1e7;

/**
 * A filter function for determining which files can be uploaded to the server.
 * @param file
 * @returns true if the file will be accepted by the server; false otherwise
 */
export function validFileFilter(file: File) {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * A function for formatting bytes in a human readable fashion for <GB sized files
 * @param bytes
 * @returns A readable fileSize
 */
// With gratitude: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes >= 1024 && bytes < 1048576) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}

/**
 * Parses the file name from an attachment's metadata
 * @param attachment
 * @returns The attachment's file name on the server
 */
export function getAttachmentName(attachment: fhir4.Attachment) {
  const urlSplit = attachment.url?.split("/");
  if (urlSplit === undefined) {
    throw Error(
      "Attachment did not have a URL defined; cannot determine attachment name without one"
    );
  }
  // The file name is at the end of the url, split on '/'
  return urlSplit[urlSplit.length - 1];
}
