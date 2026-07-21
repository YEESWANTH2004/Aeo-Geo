const { EMPTY_SHELL_TEXT_THRESHOLD } = require("../config/env");
const { cleanText } = require("./textUtils");

function isLikelyEmptyShell($) {
  const $clone = $.root().clone();
  $clone.find("script, style, noscript").remove();

  const bodyText = cleanText($clone.find("body").text());
  return bodyText.length < EMPTY_SHELL_TEXT_THRESHOLD;
}

module.exports = { isLikelyEmptyShell };
