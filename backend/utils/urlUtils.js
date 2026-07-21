function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function toAbsoluteUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function isSameOrigin(href, baseUrl) {
  try {
    const target = new URL(href, baseUrl);
    const base = new URL(baseUrl);
    return target.host === base.host;
  } catch {
    return false;
  }
}

function getOrigin(baseUrl) {
  try {
    return new URL(baseUrl).origin;
  } catch {
    return null;
  }
}

module.exports = { isValidHttpUrl, toAbsoluteUrl, isSameOrigin, getOrigin };
