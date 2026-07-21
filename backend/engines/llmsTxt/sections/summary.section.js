const { truncate } = require("../../../utils/textUtils");

function buildSummarySection(website) {
  const name = website.organization.name || website.title || "This website";
  const description =
    website.metaDescription || truncate(website.mainContent, 300);

  const lines = [`# ${website.title || website.url}`, ""];
  if (description) {
    lines.push(`> ${description}`, "");
  }
  lines.push(
    `${name} is represented at ${website.url}. This llms.txt file was generated automatically to help AI systems understand and reference this site's content.`
  );

  return lines.join("\n");
}

module.exports = { buildSummarySection };
