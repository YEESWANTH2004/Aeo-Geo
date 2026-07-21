const CATEGORY_KEYWORDS = {
  documentation: ["docs", "documentation", "developer", "api-reference", "guide"],
  api: ["api", "reference", "sdk"],
  blog: ["blog", "news", "articles", "insights"],
  contact: ["contact", "support", "help"],
  // "team" deliberately excluded: collides with product/service names like
  // "red-team"/"blue-team" assessments (common in security sites).
  about: ["about", "company", "who-we-are"],
  pricing: ["pricing", "plans"],
  legal: ["privacy", "terms", "legal", "policy"],
};

function categorizeUrl(url) {
  const path = (() => {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  })();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => path.includes(keyword))) {
      return category;
    }
  }
  return "other";
}

function categorizeLinks(links) {
  const categorized = {
    documentation: [],
    api: [],
    blog: [],
    contact: [],
    about: [],
    pricing: [],
    legal: [],
    other: [],
  };

  links.forEach((link) => {
    const category = categorizeUrl(link.href);
    categorized[category].push(link);
  });

  return categorized;
}

module.exports = { categorizeUrl, categorizeLinks };
