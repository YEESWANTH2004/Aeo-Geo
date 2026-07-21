const { cleanText } = require("../../utils/textUtils");

function extractLists($) {
  const lists = [];

  $("ul, ol").each((_, listEl) => {
    const type = listEl.tagName === "ol" ? "ol" : "ul";
    const items = [];
    $(listEl)
      .children("li")
      .each((_, li) => {
        const text = cleanText($(li).text());
        if (text) items.push(text);
      });
    if (items.length > 0) lists.push({ type, items });
  });

  return lists;
}

module.exports = { extractLists };
