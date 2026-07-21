const { createCheckResult } = require("../../../models/CheckResult.model");

function checkFaq(website) {
  const passed = website.faq.length > 0;

  return createCheckResult({
    id: "faq-content",
    label: "Has FAQ content",
    passed,
    weight: 12,
    message: passed
      ? `Found ${website.faq.length} FAQ entr${website.faq.length === 1 ? "y" : "ies"}.`
      : "No FAQ content detected (question/answer pairs or FAQPage schema).",
  });
}

module.exports = { checkFaq };
