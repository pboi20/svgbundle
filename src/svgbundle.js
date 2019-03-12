const fs = require("fs");
const path = require("path");
const svgo = require("svgo");

class SvgBundle {
  constructor() {
    this._svgProcessor = new svgo();
    this._inputFiles = [];
    this._processedFiles = [];
  }

  addFile(inputFile) {
    this._inputFiles.push(inputFile);
  }

  addFiles(inputFiles) {
    for (let file of inputFiles) {
      this.addFile(file);
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
    return JSON.stringify(output);
  }

  save(outputFile) {
    const output = this.toString();
    fs.writeFileSync(outputFile, output);
  }
}

module.exports = SvgBundle;

// ES6 compatibility
module.exports.default = SvgBundle;
