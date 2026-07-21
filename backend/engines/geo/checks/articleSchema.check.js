const { createCheckResult } = require("../../../models/CheckResult.model");
const { findByType } = require("../../../utils/schemaUtils");

function checkArticleSchema(website) {
  const articleEntities = [
    ...findByType(website.structuredData, "Article"),
    ...findByType(website.structuredData, "BlogPosting"),
    ...findByType(website.structuredData, "NewsArticle"),
  ];
  const passed = articleEntities.length > 0;

  return createCheckResult({
    id: "article-schema",
    label: "Has Article schema",
    passed,
    weight: 8,
    message: passed
      ? "Article/BlogPosting schema found."
      : "No Article schema found. Add it for content pages.",
  });
}

module.exports = { checkArticleSchema };
