import { LocalAttachment } from "../types";

/**
 * Clips attachment names to be 24 chars long, including
 * file extension and ellipsis
 * @param name The attachment name to be clipped
 *
 */
export function clipAttachmentName(name: LocalAttachment["name"]) {
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
