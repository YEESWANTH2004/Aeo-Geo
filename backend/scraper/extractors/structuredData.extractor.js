const { parseJsonLdBlocks } = require("../../utils/schemaUtils");

function extractStructuredData($) {
  return parseJsonLdBlocks($);
}

module.exports = { extractStructuredData };
