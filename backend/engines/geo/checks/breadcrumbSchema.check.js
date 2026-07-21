const { createCheckResult } = require("../../../models/CheckResult.model");

function checkBreadcrumbSchema(website) {
  const passed = website.breadcrumbs.length > 0;

  return createCheckResult({
    id: "breadcrumb-schema",
    label: "Has breadcrumb navigation",
    passed,
    weight: 6,
    message: passed
      ? `Found ${website.breadcrumbs.length} breadcrumb item(s).`
      : "No breadcrumbs found. They help establish site structure/context.",
  });
}

module.exports = { checkBreadcrumbSchema };
