function parseJsonLdBlocks($) {
  const blocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw || !raw.trim()) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        blocks.push(...parsed);
      } else if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
        blocks.push(...parsed["@graph"]);
      } else {
        blocks.push(parsed);
      }
    } catch {
      // ignore malformed JSON-LD
    }
  });
  return blocks;
}

function findByType(blocks, typeName) {
  return blocks.filter((block) => {
    const type = block["@type"];
    if (!type) return false;
    if (Array.isArray(type)) return type.includes(typeName);
    return type === typeName;
  });
}

module.exports = { parseJsonLdBlocks, findByType };
