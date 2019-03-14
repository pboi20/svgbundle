(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else if (typeof define === 'function' && define.amd) { define([], factory); }
  else { root.TestSvgBundle = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  return {"circle":"<svg width=\"265\" height=\"265\" viewBox=\"0 0 265 265\" xmlns=\"http://www.w3.org/2000/svg\"><circle stroke=\"#979797\" fill=\"#D8D8D8\" cx=\"132.5\" cy=\"132.5\" r=\"131.5\" fill-rule=\"evenodd\"/></svg>","square":"<svg width=\"263\" height=\"263\" viewBox=\"0 0 263 263\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#979797\" fill=\"#D8D8D8\" d=\"M.5.5h262v262H.5z\" fill-rule=\"evenodd\"/></svg>","triangle":"<svg width=\"265\" height=\"264\" viewBox=\"0 0 265 264\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#979797\" fill=\"#D8D8D8\" d=\"M132.5 0L264 263H1z\" fill-rule=\"evenodd\"/></svg>"};
}));