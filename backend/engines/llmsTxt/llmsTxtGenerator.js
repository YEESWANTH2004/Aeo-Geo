const { buildSummarySection } = require("./sections/summary.section");
const { buildTopicsSection } = require("./sections/topics.section");
const {
  buildAiUsageRecommendationsSection,
} = require("./sections/aiUsageRecommendations.section");
const {
  selectProductsServicesLinks,
  buildProductsServicesSection,
} = require("./sections/productsServices.section");
const {
  buildCategorizedLinksSection,
} = require("./sections/categorizedLinks.section");

// Order matters for spec compliance: H1 + blockquote + heading-free detail
// sections must all come before any H2 (link-list) sections.
function generateLlmsTxt(website) {
  const productsServicesLinks = selectProductsServicesLinks(website);
  const productsServicesHrefs = new Set(productsServicesLinks.map((l) => l.href));

  const sections = [
    buildSummarySection(website),
    buildTopicsSection(website),
    buildAiUsageRecommendationsSection(website),
    buildProductsServicesSection(productsServicesLinks),
    buildCategorizedLinksSection(website, productsServicesHrefs),
  ].filter(Boolean);

  return sections.join("\n\n") + "\n";
}

module.exports = { generateLlmsTxt };
