const { createCheckResult } = require("../../../models/CheckResult.model");

function checkEntityRichContent(website) {
  const entityTypeCount = new Set(
    website.structuredData
      .map((block) => block["@type"])
      .flat()
      .filter(Boolean)
  ).size;

  const passed = entityTypeCount >= 2;

  return createCheckResult({
    id: "entity-rich-content",
    label: "Entity-rich structured content",
    passed,
    weight: 8,
    message: passed
      ? `${entityTypeCount} distinct schema entity types found.`
      : `Only ${entityTypeCount} schema entity type(s) found. Diversify structured data entities.`,
  });
}

module.exports = { checkEntityRichContent };
