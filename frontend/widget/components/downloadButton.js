export function renderDownloadButton(getText) {
  const button = document.createElement("button");
  button.className = "aeo-geo-widget__button";
  button.type = "button";
  button.textContent = "Download llms.txt";

  button.addEventListener("click", () => {
    const blob = new Blob([getText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "llms.txt";
    link.click();
    URL.revokeObjectURL(url);
  });

  return button;
}
