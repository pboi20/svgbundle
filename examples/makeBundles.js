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
  const jsonFile = path.resolve(__dirname, "bundles/shapes.json");
  bundler.save(jsonFile);

  const esmFile = path.resolve(__dirname, "bundles/shapes.js");
  bundler.setOutputMode(SvgBundle.ESM);
  bundler.save(esmFile);

  const umdFile = path.resolve(__dirname, "bundles/shapes-umd.js");
  bundler.setOutputMode(SvgBundle.UMD);
  bundler.setBundleName("Shapes");
  bundler.save(umdFile);
});
