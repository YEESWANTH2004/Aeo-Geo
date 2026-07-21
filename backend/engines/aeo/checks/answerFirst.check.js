const { createCheckResult } = require("../../../models/CheckResult.model");

function checkAnswerFirst(website) {
  const firstSentence = (website.mainContent || "")
    .split(/(?<=[.!?])\s/)[0];
  const wordCount = firstSentence ? firstSentence.split(" ").length : 0;

  const passed = wordCount >= 6 && wordCount <= 40;

  return createCheckResult({
    id: "answer-first",
    label: "Leads with a concise, direct answer",
    passed,
    weight: 10,
    message: passed
      ? "Content opens with a concise statement, good for answer extraction."
      : "Opening content is missing, too short, or too long-winded. Lead with a direct answer.",
  });
}

module.exports = { checkAnswerFirst };
