const { cleanText } = require("../../utils/textUtils");
const { findByType } = require("../../utils/schemaUtils");

function extractBreadcrumbsFromSchema(structuredData) {
  const breadcrumbLists = findByType(structuredData, "BreadcrumbList");
  if (breadcrumbLists.length === 0) return [];

  const items = breadcrumbLists[0].itemListElement || [];
  return items
    .map((item) => ({
      name: item.name || (item.item && item.item.name) || null,
      url: item.item ? (typeof item.item === "string" ? item.item : item.item.id || item.item["@id"]) : null,
    }))
    .filter((crumb) => crumb.name);
}

function extractBreadcrumbsFromDom($) {
  const crumbs = [];
  $('[class*="breadcrumb"] a, nav[aria-label="breadcrumb"] a').each((_, el) => {
    const name = cleanText($(el).text());
    const url = $(el).attr("href") || null;
    if (name) crumbs.push({ name, url });
  });
  return crumbs;
}

function extractBreadcrumbs($, structuredData) {
  const fromSchema = extractBreadcrumbsFromSchema(structuredData);
  if (fromSchema.length > 0) return fromSchema;
  return extractBreadcrumbsFromDom($);
}

module.exports = { extractBreadcrumbs };
