const { createCheckResult } = require("../../../models/CheckResult.model");

function checkHeadingHierarchy(website) {
  const { h1, h2, h3 } = website.headings;
  const hasSingleH1 = h1.length === 1;
  const hasSubHeadings = h2.length > 0 || h3.length > 0;
  const passed = hasSingleH1 && hasSubHeadings;

  let message;
  if (h1.length === 0) message = "Missing H1 heading.";
  else if (h1.length > 1) message = `Found ${h1.length} H1 headings; use exactly one.`;
  else if (!hasSubHeadings) message = "H1 present but no H2/H3 sub-headings found.";
  else message = "Clear single-H1 hierarchy with sub-headings.";

  return createCheckResult({
    id: "heading-hierarchy",
    label: "Proper heading hierarchy",
    passed,
    weight: 8,
    message,
  });
}

module.exports = { checkHeadingHierarchy };
