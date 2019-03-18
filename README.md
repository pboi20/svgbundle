# svgbundle

svgbundle is a Nodejs utility for optimizing and bundling multiple SVG files into a single JavaScript module. It uses [SVGO](https://github.com/svg/svgo/) as the image processor.


### Requirements

- Nodejs >= 8.0


### Installation

```
npm install -g pboi20/svgbundle
```


### Usage


#### CLI

```
usage: svgbundle [OPTIONS] INPUT_FILES

positional arguments:
  INPUT_FILES             Input files to be optimized and bundled.

optional arguments:
  -m MODE, --mode=MODE    Output mode. (Choices: json, esm, umd. Default: json.)
  -n NAME, --name=NAME    Bundle name to be used with UMD output.
  -o FILE, --output=FILE  Output file name. (Default: STDOUT.)
```

Example:

```
svgbundle -o arrows-bundle.json up.svg down.svg left.svg right.svg
```


#### Nodejs

```js
const svgb = require("svgbundle")

new svgb({
  outputMode: svgb.UMD,
  bundleName: "Arrows",
  inputFiles: ["./up.svg", "./down.svg", "./left.svg", "./right.svg"],
  svgo: {
    plugins: [
      { removeViewBox: false }
    ]
  }
})
.process()
.then(bundle => {
  bundle.save("./arrows-umd.js")
  console.log("Done!")
})
```

See [examples/](https://github.com/pboi20/svgbundle/tree/master/examples) for more.


### Disclaimer

This is a work in progress :)

[MIT License](https://github.com/pboi20/svgbundle/blob/master/LICENSE)

