function createAnalysisResult({
  website,
  scores,
  checks,
  recommendations,
  generatedLlmsTxt,
  pagesCrawled,
}) {
  return {
    website,
    scores,
    checks,
    recommendations,
    generatedLlmsTxt,
    pagesCrawled,
  };
}

module.exports = { createAnalysisResult };
