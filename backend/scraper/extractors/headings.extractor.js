const { spacedText } = require("../../utils/htmlParser");

function extractHeadings($) {
  const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  Object.keys(headings).forEach((tag) => {
    $(tag).each((_, el) => {
      const text = spacedText($, el);
      if (text) headings[tag].push(text);
    });
  });
  return headings;
}

module.exports = { extractHeadings };
