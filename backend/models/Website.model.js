function createWebsiteModel(overrides = {}) {
  return {
    url: null,
    title: null,
    metaDescription: null,
    headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    navigation: [],
    mainContent: "",
    faq: [],
    articles: [],
    tables: [],
    lists: [],
    links: { internal: [], external: [] },
    images: [],
    structuredData: [],
    author: { name: null, url: null },
    dates: { published: null, modified: null },
    organization: { name: null, logo: null, sameAs: [] },
    breadcrumbs: [],
    ...overrides,
  };
}

module.exports = { createWebsiteModel };
