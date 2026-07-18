'use strict';

module.exports = Object.freeze({
  version: '1.0.0',
  thresholds: Object.freeze({
    htmlBytesGood: 100 * 1024,
    htmlBytesWarn: 200 * 1024,
    domNodesGood: 1200,
    domNodesWarn: 1800,
    inlineCssBytesGood: 12 * 1024,
    inlineCssBytesWarn: 30 * 1024,
    scriptCountGood: 8,
    scriptCountWarn: 15,
    cssCountGood: 6,
    cssCountWarn: 10
  }),
  weights: Object.freeze({
    htmlSize: 8,
    domSize: 8,
    noBlockingScripts: 14,
    limitedScripts: 6,
    limitedStylesheets: 5,
    inlineCss: 5,
    lazyImages: 10,
    imageDimensions: 12,
    modernImages: 8,
    imageAlt: 4,
    fontDisplay: 5,
    fontPreconnect: 3,
    preloadLcp: 5,
    noDuplicateAssets: 4,
    viewport: 3
  })
});
