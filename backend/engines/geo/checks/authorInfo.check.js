const { createCheckResult } = require("../../../models/CheckResult.model");

function checkAuthorInfo(website) {
  const passed = Boolean(website.author.name);

  return createCheckResult({
    id: "author-info",
    label: "Has identifiable author information",
    passed,
    weight: 8,
    message: passed
      ? `Author identified: ${website.author.name}.`
      : "No author information found. Attribution builds E-E-A-T trust signals.",
  });
}

module.exports = { checkAuthorInfo };
