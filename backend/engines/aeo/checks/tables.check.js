const { createCheckResult } = require("../../../models/CheckResult.model");

function checkTables(website) {
  const passed = website.tables.length > 0;

  return createCheckResult({
    id: "tables-usage",
    label: "Uses tables for structured facts",
    passed,
    weight: 6,
    message: passed
      ? `Found ${website.tables.length} table(s).`
      : "No tables found. Tables help present comparable/structured data.",
  });
}

module.exports = { checkTables };
