const PASS_ICON = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="currentColor" fill-opacity="0.15"/><path d="M6 10.5L8.5 13L14 7" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const FAIL_ICON = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="currentColor" fill-opacity="0.15"/><path d="M7 7L13 13M13 7L7 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function renderCheckItem(check) {
  const li = document.createElement("li");
  li.className = "check-item";

  const icon = document.createElement("span");
  icon.className = check.passed ? "check-item__icon--pass" : "check-item__icon--fail";
  icon.innerHTML = check.passed ? PASS_ICON : FAIL_ICON;

  const text = document.createElement("span");
  text.className = "check-item__text";
  const label = document.createElement("strong");
  label.textContent = check.label;
  text.appendChild(label);
  text.appendChild(document.createTextNode(` — ${check.message}`));

  li.appendChild(icon);
  li.appendChild(text);
  return li;
}

export function renderChecksList(title, checks) {
  const wrapper = document.createElement("div");

  const heading = document.createElement("div");
  heading.className = "aeo-geo-widget__section-title";
  heading.textContent = title;

  const list = document.createElement("ul");
  list.className = "aeo-geo-widget__checks";
  checks.forEach((check) => list.appendChild(renderCheckItem(check)));

  wrapper.appendChild(heading);
  wrapper.appendChild(list);
  return wrapper;
}
