const PRODUCT_KEYWORDS = ["product", "service", "solution", "feature", "plan"];

function selectProductsServicesLinks(website) {
  const candidates = [...website.navigation, ...website.links.internal];

  const matches = candidates.filter((item) => {
    const text = (item.text || "").toLowerCase();
    const href = (item.href || "").toLowerCase();
    return PRODUCT_KEYWORDS.some(
      (keyword) => text.includes(keyword) || href.includes(keyword)
    );
  });

  return [...new Map(matches.map((m) => [m.href, m])).values()];
}

function buildProductsServicesSection(links) {
  if (links.length === 0) return null;

  const lines = ["## Products / Services", ""];
  links.forEach((item) => {
    lines.push(`- [${item.text || item.href}](${item.href})`);
  });

  return lines.join("\n");
}

module.exports = { selectProductsServicesLinks, buildProductsServicesSection };
