import { canJobChangeStatus } from "../../lib/exportJobHelpers";

describe("canJobChangeStatus", () => {
  test("True for jobs with status `in-review`", () => {
    const exampleJob = { status: "in-review" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(exampleJob)).toBe(true);
  });
  test("True for jobs with status `awaiting-input`", () => {
    const exampleJob = { status: "awaiting-input" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(exampleJob)).toBe(true);
  });
  test("True for jobs with status `requested`", () => {
    const exampleJob = { status: "requested" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(exampleJob)).toBe(true);
  });
  test("False for other job statuses", () => {
    const abortedJob = { status: "aborted" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(abortedJob)).toBe(false);
    const approvedJob = { status: "approved" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(approvedJob)).toBe(false);
    const rejectedJob = { status: "rejected" } as EHIApp.ExportJob;
    expect(canJobChangeStatus(rejectedJob)).toBe(false);
  });
});
