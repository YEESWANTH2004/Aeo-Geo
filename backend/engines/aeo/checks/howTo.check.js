const { createCheckResult } = require("../../../models/CheckResult.model");
const { findByType } = require("../../../utils/schemaUtils");

function checkHowTo(website) {
  const howToEntities = findByType(website.structuredData, "HowTo");
  const passed = howToEntities.length > 0;

  return createCheckResult({
    id: "howto-schema",
    label: "Has HowTo structured data",
    passed,
    weight: 8,
    message: passed
      ? "HowTo schema detected."
      : "No HowTo schema found. Add it for step-by-step content.",
  });
}

module.exports = { checkHowTo };
