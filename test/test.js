const assert = require("assert");
const fs = require("fs");
const path = require("path");

const SvgBundle = require("../src/svgbundle");

describe("SvgBundle", () => {
  const testImgDir = path.resolve(__dirname, "img");
  const testImgPaths = [
    `${testImgDir}/circle.svg`,
    `${testImgDir}/square.svg`,
    `${testImgDir}/triangle.svg`,
  ];

  describe("instance configuration", () => {
    it("should handle outputMode option", () => {
      for (let mode of [SvgBundle.JSON, SvgBundle.ESM, SvgBundle.UMD]) {
        let bundler = new SvgBundle({ outputMode: mode});
        assert.equal(bundler._outputMode, mode);
      }
    });

    it("should handle bundleName option", () => {
      const bundleName = "Testing";
      const bundler = new SvgBundle({ bundleName });
      assert.equal(bundler._bundleName, bundleName);
    });

    it("should handle inputFiles option", () => {
      const inputDir = path.resolve(__dirname, "img");
      const inputFiles = fs.readdirSync(inputDir);
      const bundler = new SvgBundle({ inputFiles });
      assert.equal(bundler._inputFiles.length, 3);
    });

    it("should handle svgo options", () => {
      const bundler = new SvgBundle({
        svgo: {
          plugins: [ {removeViewBox: false} ]
        }
      });
      assert.ok(bundler._svgProcessor);
    });
  });

  describe("setOutputMode", () => {
    it("should handle valid modes", () => {
      const bundler = new SvgBundle();
      for (let mode of [SvgBundle.JSON, SvgBundle.ESM, SvgBundle.UMD]) {
        bundler.setOutputMode(mode);
        assert.equal(bundler._outputMode, mode);
      }
    });

    it("should convert invalid modes to json", () => {
      const bundler = new SvgBundle();
      bundler.setOutputMode("CSV");
      assert.equal(bundler._outputMode, SvgBundle.JSON);
    });
  });

  describe("addFile", () => {
    it("should add file to inputFiles", () => {
      const bundler = new SvgBundle();
      assert.equal(0, bundler._inputFiles.length);
      const filePath = path.resolve(__dirname, "img/circle.svg");
      bundler.addFile(filePath);
      assert.equal(bundler._inputFiles.length, 1);
    });
  });

  describe("addFiles", () => {
    it("should add files to inputFiles", () => {
      const bundler = new SvgBundle();
      assert.equal(bundler._inputFiles.length, 0);
      bundler.addFiles(testImgPaths);
      assert.equal(bundler._inputFiles.length, 3);
    });
  });

  const processedBundle = new SvgBundle();

  describe("process", () => {
    it("should process input file", (done) => {
      processedBundle.addFile(testImgPaths[0]);
      processedBundle.process().then(() => done());
    });
  });

  describe("toString", () => {
    const expectedJSON = '{"circle":"<svg width=\\"265\\" height=\\"265\\" xmlns=\\"http://www.w3.org/2000/svg\\"><circle stroke=\\"#979797\\" fill=\\"#D8D8D8\\" cx=\\"132.5\\" cy=\\"132.5\\" r=\\"131.5\\" fill-rule=\\"evenodd\\"/></svg>"}';

    it("should produce JSON output", () => {
      processedBundle.setOutputMode(SvgBundle.JSON);
      assert.equal(processedBundle.toString(), expectedJSON);
    });

    it("should produce ESM output", () => {
      processedBundle.setOutputMode(SvgBundle.ESM);
      const matchStart = /^export default/.test(processedBundle.toString());
      assert.ok(matchStart);
    });

    it("should produce UMD output", () => {
      processedBundle.setOutputMode(SvgBundle.UMD);
      const matchStart = /^\(function \(root, factory\) {/.test(processedBundle.toString());
      assert.ok(matchStart);
      const matchBundleName = /MySvgBundle/.test(processedBundle.toString());
      assert.ok(matchBundleName);
    });
  });
});
