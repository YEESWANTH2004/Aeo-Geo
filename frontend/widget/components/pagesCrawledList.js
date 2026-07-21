export function renderPagesCrawled(pagesCrawled) {
  const wrapper = document.createElement("div");

  const heading = document.createElement("div");
  heading.className = "aeo-geo-widget__section-title";
  heading.textContent = `Pages Analyzed (${pagesCrawled.length})`;

  const list = document.createElement("ul");
  list.className = "aeo-geo-widget__checks";
  pagesCrawled.forEach((url) => {
    const li = document.createElement("li");
    li.textContent = url;
    list.appendChild(li);
  });

  wrapper.appendChild(heading);
  wrapper.appendChild(list);
  return wrapper;
}
