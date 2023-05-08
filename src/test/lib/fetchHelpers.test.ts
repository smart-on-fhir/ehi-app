import nock from "nock";
import { request } from "../../lib/fetchHelpers";
import exampleOperationOutcome from "../fixtures/exampleOperationOutcome.json";

const TEST_URL = "https://example.com";

describe("request", () => {
  test("Requests to a relative path will point to process.env.REACT_APP_EHI_SERVER by default", async () => {
    const response = "reached out to env-var defined server";
    const server = process.env.REACT_APP_EHI_SERVER;
    nock(process.env.REACT_APP_EHI_SERVER + "/")
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(200, response);
    expect(await request("/")).toBe(response);
  });
  test("Text responses should return as a string", async () => {
    const response = "response as text";
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(200, response);
    expect(await request(TEST_URL)).toBe(response);
  });
  test("JSON Responses should be parsed and returned as an object", async () => {
    const response = {
      someKey: "some value",
    };
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(200, response);
    expect(await request(TEST_URL)).toEqual(response);
  });
  test("GET method specified in options should be respected", async () => {
    const response = "GET successful";
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(200, response);
    expect(await request(TEST_URL, { method: "get" })).toBe(response);
  });
  test("POST method specified in options should be respected", async () => {
    const response = "POST successful";
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .post("/")
      .reply(200, response);
    expect(await request(TEST_URL, { method: "post" })).toBe(response);
  });

  test("Failing requests should throw an error", async () => {
    const errorCode = 400;
    const errorMessage = "Request failed";
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(errorCode, errorMessage);
    await expect(() => request(TEST_URL)).rejects.toThrowError(
      `${errorCode}: ${errorMessage}`
    );
  });
  test("Failing 404 requests should throw the same kind of error", async () => {
    const errorCode = 404;
    const errorMessage = "Request failed";
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(errorCode, errorMessage);
    await expect(() => request(TEST_URL)).rejects.toThrowError(
      `${errorCode}: ${errorMessage}`
    );
  });
  test("Responses returning an operation outcome should produce a human readable error message", async () => {
    const errorCode = 404;
    const errorResponse = exampleOperationOutcome;
    nock(TEST_URL)
      .defaultReplyHeaders({
        "access-control-allow-origin": "*",
        "access-control-allow-credentials": "true",
      })
      .get("/")
      .reply(errorCode, errorResponse);
    await expect(() => request(TEST_URL)).rejects.toThrowError(
      '404: Returned operation outcome of "error : Export job not found! Perhaps it has already completed."'
    );
  });
});
