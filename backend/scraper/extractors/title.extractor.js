const { cleanText } = require("../../utils/textUtils");

function extractTitle($) {
  const title = $("title").first().text();
  return cleanText(title) || null;
}

module.exports = { extractTitle };
