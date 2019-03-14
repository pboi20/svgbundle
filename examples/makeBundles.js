const fs = require("fs");
const path = require("path");

const SvgBundle = require("../src/svgbundle");

const bundler = new SvgBundle({
  svgo: {
    plugins: [
      { removeViewBox: false }
    ]
  }
});

const inputDir = path.resolve(__dirname, "../test/img");
const inputFiles = fs.readdirSync(inputDir);

for (file of inputFiles) {
  let filePath = path.resolve(inputDir, file);
  bundler.addFile(filePath);
}

bundler.process().then(() => {
  const jsonFile = path.resolve(__dirname, "bundles/bundle.json");
  bundler.save(jsonFile);

  const esmFile = path.resolve(__dirname, "bundles/bundle.js");
  bundler.setOutputMode(SvgBundle.ESM);
  bundler.save(esmFile);

  const umdFile = path.resolve(__dirname, "bundles/bundle-umd.js");
  bundler.setOutputMode(SvgBundle.UMD);
  bundler.setBundleName("TestSvgBundle");
  bundler.save(umdFile);
});