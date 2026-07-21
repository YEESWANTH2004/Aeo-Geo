const { loadHtml } = require("../utils/htmlParser");
const { fetchHtml } = require("../utils/httpClient");
const { isLikelyEmptyShell } = require("../utils/contentHeuristics");
const { renderWithHeadlessBrowser } = require("./renderPage");
const { createWebsiteModel } = require("../models/Website.model");
const logger = require("../utils/logger");

const { extractTitle } = require("./extractors/title.extractor");
const { extractMetaDescription } = require("./extractors/meta.extractor");
const { extractHeadings } = require("./extractors/headings.extractor");
const { extractNavigation } = require("./extractors/navigation.extractor");
const { extractMainContent } = require("./extractors/mainContent.extractor");
const { extractFaq } = require("./extractors/faq.extractor");
const { extractArticles } = require("./extractors/articles.extractor");
const { extractTables } = require("./extractors/tables.extractor");
const { extractLists } = require("./extractors/lists.extractor");
const { extractLinks } = require("./extractors/links.extractor");
const { extractImages } = require("./extractors/images.extractor");
const {
  extractStructuredData,
} = require("./extractors/structuredData.extractor");
const { extractAuthor } = require("./extractors/author.extractor");
const { extractDates } = require("./extractors/dates.extractor");
const { extractOrganization } = require("./extractors/organization.extractor");
const {
  extractBreadcrumbs,
} = require("./extractors/breadcrumbs.extractor");

async function scrapeWebsite(url, { browserPool } = {}) {
  let $ = null;
  let fetchError = null;

  try {
    const html = await fetchHtml(url);
    $ = loadHtml(html);
  } catch (err) {
    // Some sites block requests that declare themselves as a bot (our
    // User-Agent does, honestly). Don't give up yet - a real headless
    // browser presents as a normal browser and may get through.
    fetchError = err;
  }

  if (!$ || isLikelyEmptyShell($)) {
    const reason = fetchError
      ? `initial fetch failed (${fetchError.message})`
      : "page looks JS-rendered";
    logger.info(`${reason}, falling back to headless browser for ${url}`);
    try {
      const renderedHtml = browserPool
        ? await browserPool.render(url)
        : await renderWithHeadlessBrowser(url);
      $ = loadHtml(renderedHtml);
    } catch (err) {
      if (!$) {
        // Both the fast fetch and the headless fallback failed - nothing to extract from.
        throw fetchError || err;
      }
      logger.warn(`Headless render failed for ${url}, using static HTML instead:`, err.message);
    }
  }

  const structuredData = extractStructuredData($);

  return createWebsiteModel({
    url,
    title: extractTitle($),
    metaDescription: extractMetaDescription($),
    headings: extractHeadings($),
    navigation: extractNavigation($, url),
    mainContent: extractMainContent($),
    faq: extractFaq($, structuredData),
    articles: extractArticles($),
    tables: extractTables($),
    lists: extractLists($),
    links: extractLinks($, url),
    images: extractImages($),
    structuredData,
    author: extractAuthor($, structuredData),
    dates: extractDates($, structuredData),
    organization: extractOrganization($, structuredData),
    breadcrumbs: extractBreadcrumbs($, structuredData),
  });
}

module.exports = { scrapeWebsite };
