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

function testIs(a, b) {
  if (a !== b) {
    throw `Expected '${a}', got '${b}'`;
  }
}

{
  const modes = [SvgBundle.JSON, SvgBundle.ESM, SvgBundle.UMD];
  for (let mode of modes) {
    let bundler = new SvgBundle({ outputMode: mode});
    testIs(mode, bundler._outputMode);
  }
}

{
  const bundleName = "Testing";
  let bundler = new SvgBundle({ bundleName });
  testIs(bundleName, bundler._bundleName);
}

