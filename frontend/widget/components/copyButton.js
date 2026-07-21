export function renderCopyButton(getText) {
  const button = document.createElement("button");
  button.className = "aeo-geo-widget__button";
  button.type = "button";
  button.textContent = "Copy";

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getText());
      button.textContent = "Copied!";
      setTimeout(() => (button.textContent = "Copy"), 1500);
    } catch {
      button.textContent = "Copy failed";
      setTimeout(() => (button.textContent = "Copy"), 1500);
    }
  });

  return button;
}
