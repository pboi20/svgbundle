const fs = require("fs")
const path = require("path")
const commandLineArgs = require("command-line-args")

const SvgBundle = require("./svgbundle");

function error(message) {
  console.error(`Error - ${message}`);
  process.exit(1);
}

function resolveAndValidateFiles(files) {
  return files.map(file => {
    const absPath = path.resolve(file);
    if (!fs.existsSync(absPath)) {
      error(`File doesn't exist: ${file}`);
    }
    return absPath;
  });
}

function getConfig(options) {
  let config = {};

  if (!options.input) {
    error("No input file");
  } else {
    config.inputFiles = resolveAndValidateFiles(options.input);
  }
  config.bundleName = options.name;
  config.outputMode = options.mode;

  return config;
}

function main() {
  const options = commandLineArgs([
    { name: "input", multiple: true, defaultOption: true },
    { name: "mode", alias: "m", type: String },
    { name: "name", alias: "n", type: String },
    { name: "output", alias: "o", type: String },
  ]);
  const config = getConfig(options);
  const bundler = new SvgBundle(config);

  bundler.process().then(() => {
    if (options.output) {
      const absPath = path.resolve(options.output);
      bundler.save(absPath);
    } else {
      console.log(bundler.toString());
    }
    process.exit(0);
  });
}

module.exports = main;
