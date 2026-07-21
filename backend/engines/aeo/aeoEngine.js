const { checkQuestionHeadings } = require("./checks/questionHeadings.check");
const { checkFaq } = require("./checks/faq.check");
const { checkHowTo } = require("./checks/howTo.check");
const { checkQaContent } = require("./checks/qaContent.check");
const { checkLists } = require("./checks/lists.check");
const { checkTables } = require("./checks/tables.check");
const { checkAnswerFirst } = require("./checks/answerFirst.check");
const { checkHeadingHierarchy } = require("./checks/headingHierarchy.check");
const { checkStructuredData } = require("./checks/structuredData.check");

const CHECKS = [
  checkQuestionHeadings,
  checkFaq,
  checkHowTo,
  checkQaContent,
  checkLists,
  checkTables,
  checkAnswerFirst,
  checkHeadingHierarchy,
  checkStructuredData,
];

function runAeoEngine(website) {
  const checks = CHECKS.map((check) => check(website));

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  return { score, checks };
}

module.exports = { runAeoEngine };
