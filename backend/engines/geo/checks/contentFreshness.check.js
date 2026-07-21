const { createCheckResult } = require("../../../models/CheckResult.model");

const FRESHNESS_WINDOW_DAYS = 365;

function checkContentFreshness(website) {
  const dateStr = website.dates.modified || website.dates.published;
  if (!dateStr) {
    return createCheckResult({
      id: "content-freshness",
      label: "Content has a recognizable freshness date",
      passed: false,
      weight: 8,
      message: "No published/modified date found.",
    });
  }

  const date = new Date(dateStr);
  const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  const passed = !Number.isNaN(daysSince) && daysSince <= FRESHNESS_WINDOW_DAYS;

  return createCheckResult({
    id: "content-freshness",
    label: "Content has a recognizable freshness date",
    passed,
    weight: 8,
    message: passed
      ? `Content updated/published within the last ${FRESHNESS_WINDOW_DAYS} days.`
      : `Content appears older than ${FRESHNESS_WINDOW_DAYS} days. Consider refreshing.`,
  });
}

module.exports = { checkContentFreshness };
