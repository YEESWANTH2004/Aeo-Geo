const { scrapeWebsite } = require("../scraper/scraper");
const { createBrowserPool } = require("../scraper/browserPool");
const { categorizeUrl } = require("../engines/llmsTxt/urlCategorizer");
const { CRAWL_MAX_PAGES } = require("../config/env");
const logger = require("../utils/logger");

const PRIORITY_CATEGORIES = new Set([
  "about",
  "contact",
  "documentation",
  "blog",
  "pricing",
  "api",
]);

const MERGEABLE_LIST_FIELDS = [
  "faq",
  "articles",
  "tables",
  "lists",
  "images",
  "structuredData",
];
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

function scoreLinkImportance(link, navHrefs) {
  // Being in the site's own nav menu is a stronger, industry-agnostic signal
  // of "important page" than guessing keywords (nav authors already did that
  // curation for us). Keyword category is only used as a tiebreaker.
  const inNav = navHrefs.has(link.href) ? 2 : 0;
  const isPriorityCategory = PRIORITY_CATEGORIES.has(categorizeUrl(link.href)) ? 1 : 0;
  return inNav + isPriorityCategory;
}

function selectCrawlTargets(seedWebsite, maxAdditionalPages) {
  const seen = new Set([seedWebsite.url]);
  const navHrefs = new Set(seedWebsite.navigation.map((item) => item.href));

  const candidates = seedWebsite.links.internal.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });

  const prioritized = [...candidates].sort(
    (a, b) => scoreLinkImportance(b, navHrefs) - scoreLinkImportance(a, navHrefs)
  );

  return prioritized.slice(0, maxAdditionalPages).map((link) => link.href);
}

function mergeWebsiteModels(seed, additionalPages) {
  const merged = {
    ...seed,
    headings: HEADING_TAGS.reduce(
      (acc, tag) => ({ ...acc, [tag]: [...seed.headings[tag]] }),
      {}
    ),
    links: {
      internal: [...seed.links.internal],
      external: [...seed.links.external],
    },
  };
  MERGEABLE_LIST_FIELDS.forEach((field) => {
    merged[field] = [...seed[field]];
  });

  const seenInternal = new Set(merged.links.internal.map((l) => l.href));
  const seenExternal = new Set(merged.links.external.map((l) => l.href));

  additionalPages.forEach((page) => {
    HEADING_TAGS.forEach((tag) => merged.headings[tag].push(...page.headings[tag]));
    MERGEABLE_LIST_FIELDS.forEach((field) => merged[field].push(...page[field]));

    page.links.internal.forEach((link) => {
      if (!seenInternal.has(link.href)) {
        seenInternal.add(link.href);
        merged.links.internal.push(link);
      }
    });
    page.links.external.forEach((link) => {
      if (!seenExternal.has(link.href)) {
        seenExternal.add(link.href);
        merged.links.external.push(link);
      }
    });

    if (!merged.author.name && page.author.name) merged.author = page.author;
    if (!merged.organization.name && page.organization.name) {
      merged.organization = page.organization;
    }
    if (!merged.dates.published && page.dates.published) merged.dates = page.dates;
  });

  return merged;
}

async function crawlWebsite(seedUrl) {
  const browserPool = createBrowserPool();
  const pagesCrawled = [seedUrl];

  try {
    const seedWebsite = await scrapeWebsite(seedUrl, { browserPool });

    const additionalUrls = selectCrawlTargets(seedWebsite, CRAWL_MAX_PAGES - 1);

    const additionalPages = await Promise.all(
      additionalUrls.map(async (url) => {
        try {
          const page = await scrapeWebsite(url, { browserPool });
          pagesCrawled.push(url);
          return page;
        } catch (err) {
          logger.warn(`Skipping ${url} during crawl:`, err.message);
          return null;
        }
      })
    );

    const website = mergeWebsiteModels(
      seedWebsite,
      additionalPages.filter(Boolean)
    );

    return { website, pagesCrawled };
  } finally {
    await browserPool.close();
  }
}

module.exports = { crawlWebsite };
