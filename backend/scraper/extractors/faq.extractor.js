const { cleanText, isQuestion } = require("../../utils/textUtils");
const { findByType } = require("../../utils/schemaUtils");
const { spacedText } = require("../../utils/htmlParser");

const ACCORDION_CONTAINER_SELECTOR =
  '[class*="faq" i], [class*="accordion" i], [class*="qa-item" i]';
const MAX_ACCORDION_TEXT_LENGTH = 1500;

function extractFaqFromSchema(structuredData) {
  const faqPages = findByType(structuredData, "FAQPage");
  const faq = [];
  faqPages.forEach((page) => {
    const items = page.mainEntity;
    if (!items) return;
    const list = Array.isArray(items) ? items : [items];
    list.forEach((item) => {
      const question = item.name;
      const answer = item.acceptedAnswer && item.acceptedAnswer.text;
      if (question && answer) {
        faq.push({ question: cleanText(question), answer: cleanText(answer) });
      }
    });
  });
  return faq;
}

function extractFaqFromHeadings($) {
  const faq = [];
  $("h2, h3, h4").each((_, el) => {
    const heading = cleanText(spacedText($, el));
    if (!heading || !isQuestion(heading)) return;
    const answerText = cleanText($(el).nextUntil("h2, h3, h4").text());
    if (answerText) {
      faq.push({ question: heading, answer: answerText });
    }
  });
  return faq;
}

function extractFaqFromDetailsSummary($) {
  const faq = [];
  $("details").each((_, el) => {
    const question = cleanText(spacedText($, $(el).find("summary").first()));
    const $clone = $(el).clone();
    $clone.find("summary").remove();
    const answer = cleanText($clone.text());
    if (question && answer) faq.push({ question, answer });
  });
  return faq;
}

function extractFaqFromDefinitionList($) {
  const faq = [];
  $("dl").each((_, dl) => {
    $(dl)
      .find("dt")
      .each((_, dt) => {
        const question = cleanText(spacedText($, dt));
        const answer = cleanText($(dt).next("dd").text());
        if (question && answer && isQuestion(question)) {
          faq.push({ question, answer });
        }
      });
  });
  return faq;
}

// Catches JS-framework FAQ widgets that use plain <div>/<button> markup
// (no semantic tags) but label their containers with faq/accordion class names.
function extractFaqFromAccordionMarkup($) {
  const faq = [];
  const seenQuestions = new Set();

  $(ACCORDION_CONTAINER_SELECTOR).each((_, container) => {
    const $container = $(container);
    if ($container.parents(ACCORDION_CONTAINER_SELECTOR).length > 0) return;

    const fullText = cleanText(spacedText($, $container));
    if (!fullText || fullText.length > MAX_ACCORDION_TEXT_LENGTH) return;

    const match = fullText.match(/^(.*?\?)\s*(.*)$/s);
    if (!match) return;

    const question = cleanText(match[1]);
    const answer = cleanText(match[2]);
    const key = question.toLowerCase();

    if (question && answer && isQuestion(question) && !seenQuestions.has(key)) {
      seenQuestions.add(key);
      faq.push({ question, answer });
    }
  });

  return faq;
}

function dedupeByQuestion(faqEntries) {
  const seen = new Set();
  return faqEntries.filter((entry) => {
    const key = entry.question.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractFaq($, structuredData) {
  const combined = [
    ...extractFaqFromSchema(structuredData),
    ...extractFaqFromHeadings($),
    ...extractFaqFromDetailsSummary($),
    ...extractFaqFromDefinitionList($),
    ...extractFaqFromAccordionMarkup($),
  ];

  return dedupeByQuestion(combined);
}

module.exports = { extractFaq };
