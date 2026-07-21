(function () {
  var scriptTag = document.currentScript;
  if (!scriptTag) {
    console.error("[AeoGeoWidget] Could not resolve own <script> tag.");
    return;
  }

  var targetUrl = scriptTag.getAttribute("data-url");
  var apiBase = scriptTag.src.replace(/\/widget\.js.*$/, "");

  import(apiBase + "/widget/index.js")
    .then(function (mod) {
      mod.initWidget({ targetUrl: targetUrl, apiBase: apiBase, scriptTag: scriptTag });
    })
    .catch(function (err) {
      console.error("[AeoGeoWidget] Failed to load widget module:", err);
    });
})();
