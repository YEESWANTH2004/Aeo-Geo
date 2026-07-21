const MAX_TOPICS = 10;

// No H2 heading here by design: per the llms.txt spec, H2 sections must be
// link lists, and topic names aren't URLs. This is a heading-free detail
// block instead, placed before the H2 sections.
function buildTopicsSection(website) {
  const candidates = [
    ...website.headings.h1,
    ...website.headings.h2,
  ];

  const uniqueTopics = [...new Set(candidates.map((t) => t.trim()))].slice(
    0,
    MAX_TOPICS
  );

  if (uniqueTopics.length === 0) return null;

  return `Primary topics covered on this site: ${uniqueTopics.join(", ")}.`;
}

module.exports = { buildTopicsSection };
