'use strict';

module.exports = Object.freeze({
  schemaTypes: Object.freeze([
    'Organization',
    'WebSite',
    'Article',
    'NewsArticle',
    'BlogPosting',
    'FAQPage',
    'HowTo',
    'BreadcrumbList',
    'VideoObject',
    'Person'
  ]),
  weights: Object.freeze({
    canonical: 5,
    robots: 4,
    maxImagePreview: 6,
    openGraph: 6,
    twitterCards: 3,
    schema: 14,
    articleSchema: 7,
    breadcrumbSchema: 6,
    faqOrHowToSchema: 7,
    organizationOrWebsiteSchema: 5,
    author: 5,
    dates: 5,
    directAnswer: 7,
    structuredContent: 6,
    headings: 5,
    entities: 5,
    accessibleImages: 4
  })
});
