export async function fetchAnalysis(apiBase, targetUrl) {
  const endpoint = `${apiBase}/analyze?url=${encodeURIComponent(targetUrl)}`;
  const response = await fetch(endpoint);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze website.");
  }

  return data;
}
