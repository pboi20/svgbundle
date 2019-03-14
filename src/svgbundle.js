const fs = require("fs");
const path = require("path");
const svgo = require("svgo");

const JSON_MODE = "json";
const ESM_MODE = "esm";
const UMD_MODE = "umd";

function jsonToESM(jsonContent) {
  return `export default ${jsonContent};`;
}

function jsonToUMD(jsonContent, moduleName) {
  return `(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else if (typeof define === 'function' && define.amd) { define([], factory); }
  else { root.${moduleName} = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  return ${jsonContent};
}));`;
}

function configure(options) {
  let config = {
    bundleName: (options && options.bundleName) || "MySvgBundle",
    outputMode: (options && options.outputMode) || JSON_MODE,
    inputFiles: (options && options.inputFiles) || null,
    svgo: (options && options.svgo) || null,
  }
  return config;
}

class SvgBundle {
  constructor(options) {
    this._inputFiles = [];
    this._processedFiles = [];

    const config = configure(options);
    if (config.inputFiles) {
      this.addFiles(config.inputFiles);
    }
    this._bundleName = config.bundleName;
    this._outputMode = config.outputMode;
    this._svgProcessor = new svgo(config.svgo);
  }

  setOutputMode(mode) {
    if (mode === ESM_MODE || mode === UMD_MODE) {
      this._outputMode = mode;
    } else {
      this._outputMode = JSON_MODE;
    }
  }

  setBundleName(name) {
    this._bundleName = name;
  }

  addFile(inputFile) {
    this._inputFiles.push(inputFile);
  }

  addFiles(inputFiles) {
    if (Array.isArray(inputFiles)) {
      for (let file of inputFiles) {
        this.addFile(file);
      }
    }
  }

  _processFile(filePath) {
    return new Promise((resolve, reject) => {
      const fileId = path.basename(filePath, ".svg");
      const fileContent = fs.readFileSync(filePath);

      this._svgProcessor
        .optimize(fileContent, {path: filePath})
        .then(result => {
          this._processedFiles.push({ id: fileId, content: result.data });
          resolve(this);
        })
        .catch(error => reject(error));
    });
  }

  process() {
    return new Promise((resolve, reject) => {
      let chain;
      for (let item of this._inputFiles) {
        if (!chain) {
          chain = this._processFile(item);
        } else {
          chain = chain.then(this._processFile(item));
        }
      }
      chain
        .then(() => resolve(this))
        .catch(error => reject(error));
    });
  }

  toString() {
    let output = {};
    for (let item of this._processedFiles) {
      output[item.id] = item.content;
    }

    let jsonOutput = JSON.stringify(output);
    if (this._outputMode === ESM_MODE) {
      return jsonToESM(jsonOutput);
    }
    else if (this._outputMode === UMD_MODE) {
      return jsonToUMD(jsonOutput, this._bundleName);
    }
    return jsonOutput;
  }

  save(outputFile) {
    const output = this.toString();
    fs.writeFileSync(outputFile, output);
  }
}

SvgBundle.JSON = JSON_MODE;
SvgBundle.ESM = ESM_MODE;
SvgBundle.UMD = UMD_MODE;

module.exports = SvgBundle;

// ES6 compatibility
module.exports.default = SvgBundle;
