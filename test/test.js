const path = require("path");
const fs = require("fs");
const SvgBundle = require("../src/svgbundle");

const bundler = new SvgBundle();
const inputDir = path.resolve(__dirname, "img");
const inputFiles = fs.readdirSync(inputDir);
const outputFile = path.resolve(__dirname, "bundle.json");

for (file of inputFiles) {
  let filePath = path.resolve(inputDir, file);
  bundler.addFile(filePath);
}

bundler.saveBundle(outputFile);
