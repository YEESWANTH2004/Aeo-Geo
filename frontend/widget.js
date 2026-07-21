(function () {
  var scriptTag = document.currentScript;
  if (!scriptTag) {
    console.error("[AeoGeoWidget] Could not resolve own <script> tag.");
    return;
  }

  var targetUrl = scriptTag.getAttribute("data-url");
  var assetBase = scriptTag.src.replace(/\/widget\.js.*$/, "");
  var apiBase = scriptTag.getAttribute("data-api-base") || assetBase;

  import(assetBase + "/widget/index.js")
    .then(function (mod) {
      mod.initWidget({
        targetUrl: targetUrl,
        apiBase: apiBase,
        assetBase: assetBase,
        scriptTag: scriptTag
      });
    })
    .catch(function (err) {
      console.error("[AeoGeoWidget] Failed to load widget module:", err);
    });
})();
