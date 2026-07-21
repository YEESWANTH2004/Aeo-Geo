const { createCheckResult } = require("../../../models/CheckResult.model");
const { isQuestion } = require("../../../utils/textUtils");

function checkQuestionHeadings(website) {
  const allHeadings = [
    ...website.headings.h1,
    ...website.headings.h2,
    ...website.headings.h3,
    ...website.headings.h4,
  ];
  const questionHeadings = allHeadings.filter(isQuestion);
  const passed = questionHeadings.length > 0;

  return createCheckResult({
    id: "question-headings",
    label: "Uses question-style headings",
    passed,
    weight: 10,
    message: passed
      ? `Found ${questionHeadings.length} question-style heading(s).`
      : "No question-style headings found (e.g. 'What is...', 'How to...').",
  });
}

module.exports = { checkQuestionHeadings };
