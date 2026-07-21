const { cleanText } = require("../../utils/textUtils");
const { toAbsoluteUrl } = require("../../utils/urlUtils");
const { spacedText } = require("../../utils/htmlParser");

function extractNavigation($, baseUrl) {
  const navItems = [];
  const seen = new Set();

  $("nav a, header a").each((_, el) => {
    const text = cleanText(spacedText($, el));
    const href = toAbsoluteUrl($(el).attr("href"), baseUrl);
    if (!text || !href || seen.has(href)) return;
    seen.add(href);
    navItems.push({ text, href });
  });

  return navItems;
}

module.exports = { extractNavigation };
