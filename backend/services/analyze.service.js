const { crawlWebsite } = require("./crawl.service");
const { runAeoEngine } = require("../engines/aeo/aeoEngine");
const { runGeoEngine } = require("../engines/geo/geoEngine");
const { generateLlmsTxt } = require("../engines/llmsTxt/llmsTxtGenerator");
const { buildRecommendations } = require("./recommendations.service");
const { createAnalysisResult } = require("../models/AnalysisResult.model");
const cacheService = require("./cache.service");
const logger = require("../utils/logger");

async function analyzeUrl(url) {
  const cached = cacheService.get(url);
  if (cached) {
    logger.info("Cache hit for", url);
    return cached;
  }

  const { website, pagesCrawled } = await crawlWebsite(url);

  const aeoResult = runAeoEngine(website);
  const geoResult = runGeoEngine(website);
  const generatedLlmsTxt = generateLlmsTxt(website);
  const recommendations = buildRecommendations(aeoResult, geoResult);

  const overall = Math.round((aeoResult.score + geoResult.score) / 2);

  const result = createAnalysisResult({
    website: {
      url: website.url,
      title: website.title,
      metaDescription: website.metaDescription,
      organization: website.organization,
      author: website.author,
    },
    scores: { aeo: aeoResult.score, geo: geoResult.score, overall },
    checks: { aeo: aeoResult.checks, geo: geoResult.checks },
    recommendations,
    generatedLlmsTxt,
    pagesCrawled,
  });

  cacheService.set(url, result);
  return result;
}

module.exports = { analyzeUrl };
