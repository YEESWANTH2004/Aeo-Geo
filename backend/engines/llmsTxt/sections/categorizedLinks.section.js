const { categorizeLinks } = require("../urlCategorizer");

const MAX_LINKS_PER_CATEGORY = 15;
const MAX_OPTIONAL_LINKS = 20;

const CATEGORY_LABELS = {
  documentation: "Documentation",
  api: "API",
  blog: "Blog",
  contact: "Contact",
  about: "About",
  pricing: "Pricing",
  legal: "Legal",
};

function formatLink(link) {
  const label = link.text && link.text.trim() ? link.text.trim() : link.href;
  return `- [${label}](${link.href})`;
}

// Per the llms.txt spec, every H2 section must be a list of markdown
// hyperlinks ([name](url)) — no bare labels, no non-link content. Uncategorized
// links go under the spec's special "Optional" section (lower-priority URLs
// that can be skipped if a shorter context is needed).
// excludeHrefs skips links already surfaced in an earlier section (e.g.
// Products/Services) so the same URL isn't listed twice in one file.
function buildCategorizedLinksSection(website, excludeHrefs = new Set()) {
  const remainingLinks = website.links.internal.filter(
    (link) => !excludeHrefs.has(link.href)
  );
  const categorized = categorizeLinks(remainingLinks);
  const blocks = [];

  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    const links = categorized[key];
    if (!links || links.length === 0) return;
    blocks.push(
      [`## ${label}`, "", ...links.slice(0, MAX_LINKS_PER_CATEGORY).map(formatLink)].join("\n")
    );
  });

  if (categorized.other && categorized.other.length > 0) {
    blocks.push(
      ["## Optional", "", ...categorized.other.slice(0, MAX_OPTIONAL_LINKS).map(formatLink)].join(
        "\n"
      )
    );
  }

  if (blocks.length === 0) return null;
  return blocks.join("\n\n");
}

module.exports = { buildCategorizedLinksSection };
