const cheerio = require("cheerio");

function loadHtml(html) {
  return cheerio.load(html);
}

function textOf($, el) {
  return $(el).text();
}

function attrOf($, el, name) {
  return $(el).attr(name) || null;
}

// Plain .text() concatenates every descendant text node with no separator,
// so adjacent inline elements with no whitespace between them in the source
// (common in animated/word-wrapped headings and multi-part link labels)
// collapse into one run-on string. Joining each immediate child's text with
// a space fixes that without needing to know the site's specific markup.
function spacedText($, el) {
  const parts = [];
  $(el)
    .contents()
    .each((_, node) => {
      if (node.type === "text") {
        parts.push(node.data);
      } else {
        parts.push($(node).text());
      }
    });
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

module.exports = { loadHtml, textOf, attrOf, spacedText };
