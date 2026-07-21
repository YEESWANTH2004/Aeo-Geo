const { cleanText } = require("../../utils/textUtils");

function extractMetaDescription($) {
  const content =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content");
  return content ? cleanText(content) : null;
}

module.exports = { extractMetaDescription };
