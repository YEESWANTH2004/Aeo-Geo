import { renderCopyButton } from "./copyButton.js";
import { renderDownloadButton } from "./downloadButton.js";

export function renderLlmsTxtViewer(llmsTxt) {
  const wrapper = document.createElement("div");

  const toolbar = document.createElement("div");
  toolbar.className = "llms-toolbar";

  const heading = document.createElement("div");
  heading.className = "aeo-geo-widget__section-title";
  heading.textContent = "Generated llms.txt";
  heading.style.margin = "0";

  const actions = document.createElement("div");
  actions.className = "aeo-geo-widget__actions";
  actions.appendChild(renderCopyButton(() => llmsTxt));
  actions.appendChild(renderDownloadButton(() => llmsTxt));

  toolbar.appendChild(heading);
  toolbar.appendChild(actions);

  const textarea = document.createElement("textarea");
  textarea.className = "aeo-geo-widget__llms-txt";
  textarea.readOnly = true;
  textarea.value = llmsTxt;

  wrapper.appendChild(toolbar);
  wrapper.appendChild(textarea);
  return wrapper;
}
