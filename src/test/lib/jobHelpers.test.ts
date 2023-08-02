import { canJobChangeStatus } from "../../lib/jobHelpers";

describe("canJobChangeStatus", () => {
  test("True for jobs with status `retrieved`", () => {
    const exampleJob = { status: "retrieved" } as EHIApp.ExportJob;
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
});
