// The maximum size of the attachment upload
export const MAX_FILE_SIZE = 1e7;
// The max number of files
export const MAX_FILE_NUM = 5;
// A string representation of what kinds of attachments are supported
export const SUPPORTED_FILES_TEXT = `Supports CSV, JSON, excel, and most image/document file formats. Upload up to ${formatBytes(
  MAX_FILE_SIZE
)} total across ${MAX_FILE_NUM} different files at a time.`;

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

export function formatFilterAttachments(
  attachments: FileList
): [File[], Error | undefined] {
  // Must convert FileList into an iterable for filtering
  const filesArray = Array.from(attachments);
  // If we have a non-fatal error to report, collect it in this variable
  let minorError: Error | undefined;

  // Filter out files that are too large
  let filesToAdd = filesArray.filter(validFileFilter);
  if (filesToAdd.length < filesArray.length) {
    minorError = new Error(
      `Some selected files are too large, only upload files under ${formatBytes(
        MAX_FILE_SIZE
      )}.`
    );
    console.warn(minorError.message);
  }
  // Filter if we're over our file-number limit
  if (filesToAdd.length > MAX_FILE_NUM) {
    const errorMessage = `Number of files provided exceeds MAX_FILE_NUM of ${MAX_FILE_NUM}, only using the first ${MAX_FILE_NUM}.`;
    if (minorError) {
      minorError = new Error(
        `${minorError.message} Additionally: ${errorMessage}`
      );
    } else {
      minorError = new Error(errorMessage);
    }
    console.warn(minorError.message);
    filesToAdd = filesToAdd.slice(0, MAX_FILE_NUM);
  }

  return [filesToAdd, minorError];
}
