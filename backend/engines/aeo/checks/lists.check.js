const { createCheckResult } = require("../../../models/CheckResult.model");

function checkLists(website) {
  const passed = website.lists.length > 0;

  return createCheckResult({
    id: "lists-usage",
    label: "Uses ordered/unordered lists",
    passed,
    weight: 6,
    message: passed
      ? `Found ${website.lists.length} list(s), which AI engines can parse easily.`
      : "No lists found. Lists help answer engines extract discrete facts.",
  });
}

module.exports = { checkLists };
