const axios = require("axios");
const { REQUEST_TIMEOUT_MS, USER_AGENT } = require("../config/env");

const httpClient = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "User-Agent": USER_AGENT,
    Accept: "text/html,application/xhtml+xml",
  },
  maxRedirects: 5,
  validateStatus: (status) => status >= 200 && status < 400,
});

async function fetchHtml(url) {
  const response = await httpClient.get(url);
  const contentType = response.headers["content-type"] || "";
  if (!contentType.includes("text/html") && !contentType.includes("xml")) {
    throw new Error(`Unsupported content-type: ${contentType}`);
  }
  return response.data;
}

module.exports = { fetchHtml };
