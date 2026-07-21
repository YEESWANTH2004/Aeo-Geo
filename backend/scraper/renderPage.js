const { chromium } = require("playwright");
const { HEADLESS_RENDER_TIMEOUT_MS } = require("../config/env");

async function renderWithHeadlessBrowser(url, sharedBrowser) {
  const browser = sharedBrowser || (await chromium.launch());

  try {
    // Deliberately not setting our bot-identifying User-Agent here: the whole
    // point of this fallback is to render as a real browser would, including
    // to sites that block requests declaring themselves as a bot.
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: HEADLESS_RENDER_TIMEOUT_MS,
      });
      // Best-effort extra settle time for client-rendered content; sites with
      // ongoing background network activity (analytics, chat widgets, polling)
      // may never truly go idle, so this is allowed to time out silently.
      await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
      return await page.content();
    } finally {
      await context.close();
    }
  } finally {
    if (!sharedBrowser) await browser.close();
  }
}

module.exports = { renderWithHeadlessBrowser };
