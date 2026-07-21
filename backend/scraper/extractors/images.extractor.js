const { cleanText } = require("../../utils/textUtils");

function extractImages($) {
  const images = [];
  $("img").each((_, el) => {
    const alt = cleanText($(el).attr("alt"));
    images.push({ alt: alt || null });
  });
  return images;
}

module.exports = { extractImages };
