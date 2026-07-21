const { cleanText, truncate } = require("../../utils/textUtils");
const { MAX_MAIN_CONTENT_CHARS } = require("../../config/env");

const NOISE_SELECTORS = [
  "script",
  "style",
  "noscript",
  "nav",
  "header",
  "footer",
  "iframe",
  "svg",
];

const BLOCK_SELECTOR =
  "p, li, h1, h2, h3, h4, h5, h6, td, th, blockquote, figcaption";

function selectMainContentCandidate($, $clone) {
  return $clone.find("main").first().length
    ? $clone.find("main").first()
    : $clone.find("article").first().length
    ? $clone.find("article").first()
    : $clone.find("body").first();
}

function extractMainContent($) {
  const $clone = $.root().clone();
  NOISE_SELECTORS.forEach((selector) => $clone.find(selector).remove());

  const candidate = selectMainContentCandidate($, $clone);

  const blocks = [];
  candidate.find(BLOCK_SELECTOR).each((_, el) => {
    const text = cleanText($(el).text());
    if (text) blocks.push(text);
  });

  const text = blocks.length > 0 ? blocks.join(" ") : cleanText(candidate.text());
  return truncate(text, MAX_MAIN_CONTENT_CHARS);
}

module.exports = { extractMainContent };
