'use strict';

module.exports = Object.freeze({
  safeRules: Object.freeze([
    'canonical',
    'robots-max-image-preview',
    'og-locale',
    'twitter-card',
    'image-loading',
    'image-decoding',
    'external-link-security'
  ]),
  skipFiles: Object.freeze([
    '404.html',
    'thank-you.html'
  ])
});
