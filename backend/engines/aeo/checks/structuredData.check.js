const { createCheckResult } = require("../../../models/CheckResult.model");

function checkStructuredData(website) {
  const passed = website.structuredData.length > 0;

  return createCheckResult({
    id: "structured-data-presence",
    label: "Has structured data (JSON-LD)",
    passed,
    weight: 12,
    message: passed
      ? `Found ${website.structuredData.length} structured data block(s).`
      : "No JSON-LD structured data found. This significantly helps AI answer engines.",
  });
}

module.exports = { checkStructuredData };
