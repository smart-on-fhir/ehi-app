import {
  validFileFilter,
  formatBytes,
  getAttachmentName,
  MAX_FILE_SIZE,
} from "../../lib/attachmentUploadHelpers";

describe("validFileFilter", () => {
  test("true for files whose size is less than MAX_FILE_SIZE", () => {
    const mockFile = { size: 0 } as File;
    expect(validFileFilter(mockFile)).toBe(true);
  });
  test("true for files whose size is equal to MAX_FILE_SIZE", () => {
    const mockFile = { size: MAX_FILE_SIZE } as File;
    expect(validFileFilter(mockFile)).toBe(true);
  });
  test("false for files whose size is greater than MAX_FILE_SIZE", () => {
    const mockFile = { size: MAX_FILE_SIZE + 1 } as File;
    expect(validFileFilter(mockFile)).toBe(false);
  });
});

describe("formatBytes", () => {
  test("values < 1KB are displayed in bytes", () => {
    const bytes = 2 ** 4;
    expect(formatBytes(bytes)).toBe(`${bytes} bytes`);
  });
  test("values < 1KB are not fixed to a decimal place", () => {
    const bytes = 2 ** 4;
    expect(formatBytes(bytes)).toBe(`${bytes} bytes`);
    expect(formatBytes(bytes)).not.toBe(`${bytes.toFixed(1)} bytes`);
  });
  test("values >= 1KB but < 1MB are displayed in KB", () => {
    const kilobyte = 2 ** 10;
    expect(formatBytes(kilobyte)).toBe(`1.0 KB`);
  });
  test("KB values are rounded to 1 decimal place", () => {
    const bytes = 2 ** 10 + 20;
    expect(formatBytes(bytes)).toBe(`${(bytes / 2 ** 10).toFixed(1)} KB`);
    expect(formatBytes(bytes)).not.toBe(`${(bytes / 2 ** 10).toFixed(0)} KB`);
    expect(formatBytes(bytes)).not.toBe(`${(bytes / 2 ** 10).toFixed(2)} KB`);
  });
  test("values >= 1MB are displayed in MB", () => {
    const megabyte = 2 ** 20;
    expect(formatBytes(megabyte)).toBe("1.0 MB");
  });
  test("MB values are rounded to 1 decimal place", () => {
    const bytes = 2 ** 22;
    expect(formatBytes(bytes)).toBe(`${(bytes / 2 ** 20).toFixed(1)} MB`);
    expect(formatBytes(bytes)).not.toBe(`${(bytes / 2 ** 20).toFixed(0)} MB`);
    expect(formatBytes(bytes)).not.toBe(`${(bytes / 2 ** 20).toFixed(2)} MB`);
  });
});

describe("getAttachmentName", () => {
  test("throws an error if the attachment has no url property", () => {
    const fakeAttachment = {} as fhir4.Attachment;
    expect(() => getAttachmentName(fakeAttachment)).toThrowError(
      "Attachment did not have a URL defined; cannot determine attachment name without one"
    );
  });
  test("it returns the last /-delimited value in the URL field", () => {
    const fakeAttachment = {
      url: "url/jobs/:id/download/attachments/filename",
    } as fhir4.Attachment;
    expect(getAttachmentName(fakeAttachment)).toBe("filename");
  });
});
