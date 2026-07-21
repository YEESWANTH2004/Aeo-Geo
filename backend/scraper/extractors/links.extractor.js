const { toAbsoluteUrl, isSameOrigin } = require("../../utils/urlUtils");
const { cleanText } = require("../../utils/textUtils");
const { spacedText } = require("../../utils/htmlParser");

const NOISE_HREF_SUBSTRINGS = ["/cdn-cgi/l/email-protection"];
const NOISE_TEXT_PATTERNS = [/^skip to/i];

function isNoiseLink(href, text) {
  if (NOISE_HREF_SUBSTRINGS.some((needle) => href.includes(needle))) return true;
  if (text && NOISE_TEXT_PATTERNS.some((pattern) => pattern.test(text))) return true;
  return false;
}

function extractLinks($, baseUrl) {
  const internal = [];
  const external = [];
  const seen = new Set();

  $("a[href]").each((_, el) => {
    const href = toAbsoluteUrl($(el).attr("href"), baseUrl);
    if (!href || seen.has(href)) return;

    const text = cleanText(spacedText($, el));
    if (isNoiseLink(href, text)) return;

    seen.add(href);
    const entry = { text: text || null, href };

    if (isSameOrigin(href, baseUrl)) {
      internal.push(entry);
    } else {
      external.push(entry);
    }
  });

  return { internal, external };
}

module.exports = { extractLinks };
