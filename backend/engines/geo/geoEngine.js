const { checkSemanticHtml } = require("./checks/semanticHtml.check");
const { checkOrganizationSchema } = require("./checks/organizationSchema.check");
const { checkPersonSchema } = require("./checks/personSchema.check");
const { checkArticleSchema } = require("./checks/articleSchema.check");
const { checkBreadcrumbSchema } = require("./checks/breadcrumbSchema.check");
const { checkInternalLinks } = require("./checks/internalLinks.check");
const { checkAuthorInfo } = require("./checks/authorInfo.check");
const { checkEeat } = require("./checks/eeat.check");
const { checkEntityRichContent } = require("./checks/entityRichContent.check");
const { checkContentFreshness } = require("./checks/contentFreshness.check");

const CHECKS = [
  checkSemanticHtml,
  checkOrganizationSchema,
  checkPersonSchema,
  checkArticleSchema,
  checkBreadcrumbSchema,
  checkInternalLinks,
  checkAuthorInfo,
  checkEeat,
  checkEntityRichContent,
  checkContentFreshness,
];

function runGeoEngine(website) {
  const checks = CHECKS.map((check) => check(website));

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  return { score, checks };
}

module.exports = { runGeoEngine };
