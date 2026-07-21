function cleanText(text) {
  return (text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  const clean = cleanText(text);
  return clean ? clean.split(" ").length : 0;
}

function truncate(text, maxChars) {
  const clean = cleanText(text);
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars).trim() + "...";
}

function isQuestion(text) {
  const clean = cleanText(text).toLowerCase();
  if (!clean) return false;
  if (clean.endsWith("?")) return true;
  const questionStarters = [
    "what",
    "why",
    "how",
    "when",
    "where",
    "who",
    "which",
    "can",
    "does",
    "do",
    "is",
    "are",
  ];
  const firstWord = clean.split(" ")[0];
  return questionStarters.includes(firstWord);
}

module.exports = { cleanText, wordCount, truncate, isQuestion };
