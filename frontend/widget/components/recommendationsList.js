const PRIORITY_STATUS = {
  high: "critical",
  medium: "warning",
  low: "muted",
};

function renderRecommendationItem(rec) {
  const li = document.createElement("li");
  li.className = "rec-item";

  const badge = document.createElement("span");
  const statusModifier = PRIORITY_STATUS[rec.priority] || "muted";
  badge.className = `priority-badge priority-badge--${statusModifier}`;
  badge.textContent = rec.priority;

  const category = document.createElement("span");
  category.className = "rec-item__category";
  category.textContent = rec.category;

  const message = document.createElement("span");
  message.className = "rec-item__message";
  message.textContent = rec.message;

  li.appendChild(badge);
  li.appendChild(category);
  li.appendChild(message);
  return li;
}

export function renderRecommendations(recommendations) {
  const wrapper = document.createElement("div");

  const heading = document.createElement("div");
  heading.className = "aeo-geo-widget__section-title";
  heading.textContent = "Recommendations";

  const list = document.createElement("ul");
  list.className = "aeo-geo-widget__recommendations";

  if (recommendations.length === 0) {
    const li = document.createElement("li");
    li.className = "rec-item";
    li.textContent = "No major issues found.";
    list.appendChild(li);
  } else {
    recommendations.forEach((rec) => list.appendChild(renderRecommendationItem(rec)));
  }

  wrapper.appendChild(heading);
  wrapper.appendChild(list);
  return wrapper;
}
