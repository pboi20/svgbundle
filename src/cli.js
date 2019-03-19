const fs = require("fs")
const path = require("path")
const commandLineArgs = require("command-line-args")

const SvgBundle = require("./svgbundle");

const USAGE = `usage: svgbundle [OPTIONS] INPUT_FILES

positional arguments:
  INPUT_FILES             Input files to be optimized and bundled.

optional arguments:
  -h, --help              Show help.
  -m MODE, --mode=MODE    Output mode. (Choices: json, esm, umd. Default: json)
  -n NAME, --name=NAME    Bundle name to be used with UMD output.
  -o FILE, --output=FILE  Output file name. (Default: STDOUT)
`;

function error(message, prefix="ERROR - ") {
  console.error(`${prefix}${message}`);
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
  const args = [
    { name: "input", multiple: true, defaultOption: true },
    { name: "help", alias: "h", type: Boolean },
    { name: "mode", alias: "m", type: String },
    { name: "name", alias: "n", type: String },
    { name: "output", alias: "o", type: String },
  ];

  let options;
  try {
    options = commandLineArgs(args);
  } catch (e) {
    if (e.name == "UNKNOWN_OPTION") {
      error(`Unknown option: ${e.optionName}\n\n${USAGE}`);
    } else {
      throw e;
    }
  }

  if (options.help) {
    console.log(USAGE);
    process.exit(0);
  }

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
