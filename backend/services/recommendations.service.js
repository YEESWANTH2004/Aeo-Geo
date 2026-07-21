function buildRecommendations(aeoResult, geoResult) {
  const failedChecks = [
    ...aeoResult.checks.map((c) => ({ ...c, category: "AEO" })),
    ...geoResult.checks.map((c) => ({ ...c, category: "GEO" })),
  ].filter((c) => !c.passed);

  return failedChecks
    .sort((a, b) => b.weight - a.weight)
    .map((c) => ({
      category: c.category,
      priority: c.weight >= 10 ? "high" : c.weight >= 7 ? "medium" : "low",
      message: c.message,
    }));
}

module.exports = { buildRecommendations };
