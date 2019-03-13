const fs = require("fs");
const path = require("path");

const SvgBundle = require("../src/svgbundle");
const bundler = new SvgBundle();

const inputDir = path.resolve(__dirname, "img");
const inputFiles = fs.readdirSync(inputDir);

for (file of inputFiles) {
  let filePath = path.resolve(inputDir, file);
  bundler.addFile(filePath);
}

bundler.process().then(() => {
  const jsonFile = path.resolve(__dirname, "output/bundle.json");
  bundler.save(jsonFile);

  const esmFile = path.resolve(__dirname, "output/bundle.js");
  bundler.setOutputMode(SvgBundle.ESM);
  bundler.save(esmFile);

  const umdFile = path.resolve(__dirname, "output/bundle-umd.js");
  bundler.setOutputMode(SvgBundle.UMD);
  bundler.setBundleName("TestSvgBundle");
  bundler.save(umdFile);
});
