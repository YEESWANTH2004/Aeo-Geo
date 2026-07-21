import { renderLoader } from "./components/loader.js";
import { renderScores } from "./components/scoreCard.js";
import { renderChecksList } from "./components/checksList.js";
import { renderRecommendations } from "./components/recommendationsList.js";
import { renderLlmsTxtViewer } from "./components/llmsTxtViewer.js";
import { renderPagesCrawled } from "./components/pagesCrawledList.js";

const REVEAL_STAGGER_MS = 70;

function createContainer(scriptTag) {
  const container = document.createElement("div");
  container.className = "aeo-geo-widget";

  const header = document.createElement("div");
  header.className = "aeo-geo-widget__header";
  header.textContent = "AEO / GEO Analysis";
  container.appendChild(header);

  scriptTag.insertAdjacentElement("afterend", container);
  return container;
}

function loadStyles(apiBase) {
  if (document.getElementById("aeo-geo-widget-styles")) return;
  const link = document.createElement("link");
  link.id = "aeo-geo-widget-styles";
  link.rel = "stylesheet";
  link.href = `${apiBase}/styles/widget.css`;
  document.head.appendChild(link);
}

// Appends with a cascading fade/slide-in instead of everything popping in at
// once, so the result reads as progressively "unpacked" rather than dumped.
function appendWithReveal(container, element, index) {
  element.classList.add("reveal-item");
  element.style.animationDelay = `${index * REVEAL_STAGGER_MS}ms`;
  container.appendChild(element);
}

export function renderLoading(scriptTag, apiBase) {
  loadStyles(apiBase);
  const container = createContainer(scriptTag);
  container.appendChild(renderLoader(scriptTag.getAttribute("data-url")));
  return container;
}

export function renderError(container, message) {
  container.innerHTML = "";
  const header = document.createElement("div");
  header.className = "aeo-geo-widget__header";
  header.textContent = "AEO / GEO Analysis";

  const error = document.createElement("div");
  error.className = "aeo-geo-widget__error";
  error.textContent = message;

  container.appendChild(header);
  container.appendChild(error);
}

export function renderResult(container, result) {
  container.innerHTML = "";
  container.classList.add("is-entering");
  requestAnimationFrame(() => container.classList.remove("is-entering"));

  const header = document.createElement("div");
  header.className = "aeo-geo-widget__header";
  header.textContent = `AEO / GEO Analysis — ${result.website.title || result.website.url}`;
  container.appendChild(header);

  let step = 0;
  appendWithReveal(container, renderScores(result.scores), step++);
  if (result.pagesCrawled && result.pagesCrawled.length > 0) {
    appendWithReveal(container, renderPagesCrawled(result.pagesCrawled), step++);
  }
  appendWithReveal(container, renderChecksList("AEO Checks", result.checks.aeo), step++);
  appendWithReveal(container, renderChecksList("GEO Checks", result.checks.geo), step++);
  appendWithReveal(container, renderRecommendations(result.recommendations), step++);
  appendWithReveal(container, renderLlmsTxtViewer(result.generatedLlmsTxt), step++);
}
