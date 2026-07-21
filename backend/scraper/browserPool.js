const { chromium } = require("playwright");
const { renderWithHeadlessBrowser } = require("./renderPage");

function createBrowserPool() {
  let browserPromise = null;

  return {
    async render(url) {
      if (!browserPromise) browserPromise = chromium.launch();
      const browser = await browserPromise;
      return renderWithHeadlessBrowser(url, browser);
    },
    async close() {
      if (!browserPromise) return;
      const browser = await browserPromise;
      await browser.close();
    },
  };
}

module.exports = { createBrowserPool };
