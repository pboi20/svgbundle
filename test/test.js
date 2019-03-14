const assert = require("assert");
const fs = require("fs");
const path = require("path");

const SvgBundle = require("../src/svgbundle");

describe("SvgBundle", () => {

  describe("instance configuration", () => {

    it("should handle outputMode option", () => {
      const modes = [SvgBundle.JSON, SvgBundle.ESM, SvgBundle.UMD];
      for (let mode of modes) {
        let bundler = new SvgBundle({ outputMode: mode});
        assert.equal(mode, bundler._outputMode);
      }
    });

    it("should handle bundleName option", () => {
      const bundleName = "Testing";
      const bundler = new SvgBundle({ bundleName });
      assert.equal(bundleName, bundler._bundleName);
    });

    it("should handle inputFiles option", () => {
      const inputDir = path.resolve(__dirname, "img");
      const inputFiles = fs.readdirSync(inputDir);
      const bundler = new SvgBundle({ inputFiles });
      assert.equal(3, bundler._inputFiles.length);
    });
  });
});
