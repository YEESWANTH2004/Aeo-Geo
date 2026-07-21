const { createCheckResult } = require("../../../models/CheckResult.model");

function checkInternalLinks(website) {
  const passed = website.links.internal.length >= 5;

  return createCheckResult({
    id: "internal-links",
    label: "Sufficient internal linking",
    passed,
    weight: 8,
    message: passed
      ? `Found ${website.links.internal.length} internal links.`
      : `Only ${website.links.internal.length} internal links found. Aim for 5+ to build entity/topic graph.`,
  });
}

module.exports = { checkInternalLinks };
