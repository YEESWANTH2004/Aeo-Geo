function extractDates($, structuredData) {
  const articleEntities = structuredData.filter(
    (block) => block.datePublished || block.dateModified
  );

  if (articleEntities.length > 0) {
    const entity = articleEntities[0];
    return {
      published: entity.datePublished || null,
      modified: entity.dateModified || null,
    };
  }

  const metaPublished =
    $('meta[property="article:published_time"]').attr("content") || null;
  const metaModified =
    $('meta[property="article:modified_time"]').attr("content") || null;

  const timePublished = $("time[datetime]").first().attr("datetime") || null;

  return {
    published: metaPublished || timePublished || null,
    modified: metaModified || null,
  };
}

module.exports = { extractDates };
