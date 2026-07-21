const { cleanText, truncate } = require("../../utils/textUtils");

function extractArticles($) {
  const articles = [];

  $("article").each((_, el) => {
    const title = cleanText(
      $(el).find("h1, h2, h3").first().text() || $(el).attr("aria-label")
    );
    const content = truncate(cleanText($(el).text()), 2000);
    const date = $(el).find("time").attr("datetime") || null;
    const author = cleanText($(el).find('[rel="author"], .author').first().text()) || null;

    if (title || content) {
      articles.push({ title: title || null, content, date, author });
    }
  });

  return articles;
}

module.exports = { extractArticles };
