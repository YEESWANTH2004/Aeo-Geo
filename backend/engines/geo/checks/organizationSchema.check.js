const { createCheckResult } = require("../../../models/CheckResult.model");

function checkOrganizationSchema(website) {
  const passed = Boolean(website.organization.name);

  return createCheckResult({
    id: "organization-schema",
    label: "Has Organization schema",
    passed,
    weight: 10,
    message: passed
      ? `Organization schema found: ${website.organization.name}.`
      : "No Organization schema found. Add it to establish entity identity.",
  });
}

module.exports = { checkOrganizationSchema };
