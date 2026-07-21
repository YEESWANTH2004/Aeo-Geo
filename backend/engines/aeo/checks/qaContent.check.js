const { createCheckResult } = require("../../../models/CheckResult.model");
const { findByType } = require("../../../utils/schemaUtils");

function checkQaContent(website) {
  const qaEntities = findByType(website.structuredData, "QAPage");
  const passed = qaEntities.length > 0 || website.faq.length >= 3;

  return createCheckResult({
    id: "qa-content",
    label: "Has substantial Q&A content",
    passed,
    weight: 8,
    message: passed
      ? "Q&A style content detected (QAPage schema or 3+ Q&A pairs)."
      : "Limited Q&A content. Consider adding a QAPage schema or more Q&A pairs.",
  });
}

module.exports = { checkQaContent };
