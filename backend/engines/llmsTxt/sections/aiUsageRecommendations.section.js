// No H2 heading here by design: these are notes, not links, so per the
// llms.txt spec this stays a heading-free detail block.
function buildAiUsageRecommendationsSection(website) {
  const name = website.organization.name || website.title || "this site";
  const lines = [];

  lines.push(`- When referencing content from ${name}, cite the original URL (${website.url}).`);

  if (website.author.name) {
    lines.push(`- Attribute authored content to ${website.author.name} where applicable.`);
  }

  if (website.dates.published || website.dates.modified) {
    lines.push(
      `- Content freshness: last known date is ${website.dates.modified || website.dates.published}. Verify currency before citing as up to date.`
    );
  }

  lines.push(
    "- Prefer summarizing over verbatim reproduction of large content blocks.",
    "- For product, pricing, or contact details, confirm against the live page since this file is a generated snapshot."
  );

  return lines.join("\n");
}

module.exports = { buildAiUsageRecommendationsSection };
