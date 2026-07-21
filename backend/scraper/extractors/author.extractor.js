const { cleanText } = require("../../utils/textUtils");
const { findByType } = require("../../utils/schemaUtils");

function extractAuthor($, structuredData) {
  const personEntities = findByType(structuredData, "Person");
  if (personEntities.length > 0) {
    const person = personEntities[0];
    return { name: person.name || null, url: person.url || null };
  }

  const articlesWithAuthor = structuredData.filter((block) => block.author);
  if (articlesWithAuthor.length > 0) {
    const author = articlesWithAuthor[0].author;
    if (typeof author === "string") return { name: author, url: null };
    if (author && typeof author === "object") {
      return { name: author.name || null, url: author.url || null };
    }
  }

  const metaAuthor = $('meta[name="author"]').attr("content");
  if (metaAuthor) return { name: cleanText(metaAuthor), url: null };

  const domAuthor = cleanText(
    $('[rel="author"], .author, .byline').first().text()
  );
  if (domAuthor) return { name: domAuthor, url: null };

  return { name: null, url: null };
}

module.exports = { extractAuthor };
