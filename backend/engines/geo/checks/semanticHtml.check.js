const { createCheckResult } = require("../../../models/CheckResult.model");

function checkSemanticHtml(website) {
  const hasNav = website.navigation.length > 0;
  const hasArticles = website.articles.length > 0;
  const passed = hasNav || hasArticles;

  return createCheckResult({
    id: "semantic-html",
    label: "Uses semantic HTML elements",
    passed,
    weight: 8,
    message: passed
      ? "Semantic elements detected (nav/article)."
      : "No semantic <nav>/<article> elements detected. Use semantic HTML5 tags.",
  });
}

module.exports = { checkSemanticHtml };
