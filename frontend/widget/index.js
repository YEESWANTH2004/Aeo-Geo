import { fetchAnalysis } from "./apiClient.js";
import { renderLoading, renderResult, renderError } from "./uiRenderer.js";

export async function initWidget({ targetUrl, apiBase, assetBase, scriptTag }) {
  if (!targetUrl) {
    console.error("[AeoGeoWidget] Missing data-url attribute on script tag.");
    return;
  }

  const container = renderLoading(scriptTag, assetBase);

  try {
    const result = await fetchAnalysis(apiBase, targetUrl);
    renderResult(container, result);
  } catch (err) {
    renderError(container, err.message || "Failed to analyze website.");
  }
}
