const fs = require("fs");
const path = require("path");


/*** Test file input/output ***/

const SvgBundle = require("../src/svgbundle");
const bundler = new SvgBundle({
  svgo: {
    plugins: [
      { removeViewBox: false }
    ]
  }
});

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


/*** Test config ***/

const modes = [SvgBundle.JSON, SvgBundle.ESM, SvgBundle.UMD];
for (let mode of modes) {
  let bundler = new SvgBundle({ outputMode: mode});
  if (mode !== bundler._outputMode) {
    throw `Expected '${mode}', got '${bundler._outputMode}'`;
  }
}
