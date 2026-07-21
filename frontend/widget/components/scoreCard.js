const COUNT_UP_DURATION_MS = 700;

function statusFor(score) {
  if (score >= 70) return { modifier: "good", text: "Good" };
  if (score >= 40) return { modifier: "warning", text: "Needs work" };
  return { modifier: "critical", text: "Critical" };
}

function animateCountUp(el, target) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / COUNT_UP_DURATION_MS, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = `${Math.round(eased * target)}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function renderScoreCard(label, score) {
  const status = statusFor(score);

  const card = document.createElement("div");
  card.className = "stat-tile";

  const labelEl = document.createElement("div");
  labelEl.className = "stat-tile__label";
  labelEl.textContent = label;

  const value = document.createElement("div");
  value.className = "stat-tile__value";
  value.textContent = "0";
  animateCountUp(value, score);

  const meterTrack = document.createElement("div");
  meterTrack.className = "stat-tile__meter-track";
  const meterFill = document.createElement("div");
  meterFill.className = `stat-tile__meter-fill stat-tile__meter-fill--${status.modifier}`;
  meterFill.style.width = "0%";
  meterTrack.appendChild(meterFill);

  // Animate from 0 on the next frame rather than setting the final width
  // immediately, so the fill visibly grows in instead of appearing static.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      meterFill.style.width = `${Math.max(0, Math.min(100, score))}%`;
    });
  });

  const statusEl = document.createElement("div");
  statusEl.className = `stat-tile__status stat-tile__status--${status.modifier}`;
  statusEl.textContent = status.text;

  card.appendChild(labelEl);
  card.appendChild(value);
  card.appendChild(meterTrack);
  card.appendChild(statusEl);
  return card;
}

export function renderScores(scores) {
  const container = document.createElement("div");
  container.className = "stat-tile-row";
  container.appendChild(renderScoreCard("AEO score", scores.aeo));
  container.appendChild(renderScoreCard("GEO score", scores.geo));
  container.appendChild(renderScoreCard("Overall", scores.overall));
  return container;
}
