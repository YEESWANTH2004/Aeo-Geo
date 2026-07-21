const { createCheckResult } = require("../../../models/CheckResult.model");

function checkEeat(website) {
  const signals = [
    Boolean(website.author.name),
    Boolean(website.organization.name),
    website.dates.published !== null,
    website.organization.sameAs.length > 0,
  ];
  const signalCount = signals.filter(Boolean).length;
  const passed = signalCount >= 3;

  return createCheckResult({
    id: "eeat-signals",
    label: "Strong E-E-A-T signals",
    passed,
    weight: 12,
    message: `${signalCount}/4 E-E-A-T signals present (author, organization, publish date, social/sameAs links).`,
  });
}

module.exports = { checkEeat };
