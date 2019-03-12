const svgo = require("svgo");

class SvgBundle {
  constructor() {
    this.inputFiles = [];
  }

  addFile(inputFile) {
    this.inputFiles.push(inputFile);
    console.log("Added:", inputFile);
  }

  addFiles(inputFiles) {
    for (let file of inputFiles) {
      this.addFile(file);
    }
  }

  getBundle() {
    console.log("GET BUNDLE");
  }

  saveBundle(outputFile) {
    console.log("Saving bundle", outputFile);
  }
}

module.exports = SvgBundle;

// ES6 compatibility
module.exports.default = SvgBundle;
