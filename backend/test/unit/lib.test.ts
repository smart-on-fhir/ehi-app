import Path from "path"
import { expect } from "chai"
import { unlinkSync, writeFileSync } from "fs"
import {
  getRequestBaseURL,
  getJobCustomizationUrl,
  getPrefixedFilePath
} from "../../lib"


describe("lib", () => {
  describe("getRequestBaseURL", () => {
    it("works with proxy", () => {
      const url = getRequestBaseURL({
        headers: {
          "x-forwarded-host": "host",
          "x-forwarded-proto": "proto"
        }
      } as any)
      expect(url).to.equal("proto://host")
    })

    it("works without proxy", () => {
      const url = getRequestBaseURL({
        headers: {
          "host": "host"
        },
        protocol: "proto"
      } as any)
      expect(url).to.equal("proto://host")
    })

    it("protocol defaults to http", () => {
      const url = getRequestBaseURL({
        headers: { host: "host" }
      } as any)
      expect(url).to.equal("http://host")
    })
  })

  describe("getJobCustomizationUrl", () => {
    it("returns '' if there is no link header", () => {
      const result = getJobCustomizationUrl(new Response())
      expect(result).to.equal("")
    })

    it("works", () => {
      const result = getJobCustomizationUrl(new Response(null, {
        headers: {
          link: 'xyz; rel="patient-interaction"'
        }
      }))
      expect(result).to.equal("xyz")
    })
  });

  describe("getPrefixedFilePath", () => {
    const destination = Path.join(__dirname, "../fixtures/")

    beforeEach(() => {
      writeFileSync(Path.join(destination, "x"), "", "utf8")
      writeFileSync(Path.join(destination, "1.x"), "", "utf8")
    })

    afterEach(() => {
      try {
        unlinkSync(Path.join(destination, "x"))
        unlinkSync(Path.join(destination, "1.x"))
      } catch { }
    })

    it("does not prefix if the file does not exist", () => {
      const result = getPrefixedFilePath(destination, "y")
      expect(result).to.equal(Path.join(destination, "y"))
    })

    it("prefixes with number if the file does not exist", () => {
      const result = getPrefixedFilePath(destination, "img3.png")
      expect(result).to.equal(Path.join(destination, "1.img3.png"))
    })

    it("recursive prefixing", () => {
      const result = getPrefixedFilePath(destination, "x")
      expect(result).to.equal(Path.join(destination, "2.x"))
    })
  })
});
