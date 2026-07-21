const { createCheckResult } = require("../../../models/CheckResult.model");
const { findByType } = require("../../../utils/schemaUtils");

function checkPersonSchema(website) {
  const personEntities = findByType(website.structuredData, "Person");
  const passed = personEntities.length > 0;

  return createCheckResult({
    id: "person-schema",
    label: "Has Person schema",
    passed,
    weight: 6,
    message: passed
      ? "Person schema found, useful for author identity."
      : "No Person schema found. Consider adding one for content authors.",
  });
}

module.exports = { checkPersonSchema };
