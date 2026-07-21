const STAGES = [
  "Fetching page",
  "Rendering JavaScript",
  "Extracting content",
  "Scoring AEO signals",
  "Scoring GEO signals",
  "Generating llms.txt",
];

const STAGE_INTERVAL_MS = 1700;

const CHECK_ICON = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10.5L8 13.5L15 6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function renderIconContent(state) {
  if (state === "done") return CHECK_ICON;
  if (state === "active") return '<span class="scan-step__spinner"></span>';
  return "";
}

function setStepState(li, state) {
  li.classList.remove("is-pending", "is-active", "is-done");
  li.classList.add(`is-${state}`);
  li.querySelector(".scan-step__icon").innerHTML = renderIconContent(state);
}

function renderScanFrame(targetLabel) {
  const frame = document.createElement("div");
  frame.className = "scan-frame";
  frame.innerHTML = `
    <div class="scan-frame__bar">
      <span class="scan-dot scan-dot--r"></span>
      <span class="scan-dot scan-dot--y"></span>
      <span class="scan-dot scan-dot--g"></span>
      <span class="scan-frame__url">${targetLabel || ""}</span>
    </div>
    <div class="scan-frame__body">
      <div class="scan-sweep"></div>
    </div>
  `;
  return frame;
}

function renderStageStepper() {
  const list = document.createElement("ul");
  list.className = "scan-steps";

  const stepEls = STAGES.map((label, i) => {
    const li = document.createElement("li");
    li.className = "scan-step";

    const icon = document.createElement("span");
    icon.className = "scan-step__icon";

    const text = document.createElement("span");
    text.className = "scan-step__label";
    text.textContent = label;

    li.appendChild(icon);
    li.appendChild(text);
    list.appendChild(li);

    setStepState(li, i === 0 ? "active" : "pending");
    return li;
  });

  let current = 0;
  const advance = () => {
    if (current >= stepEls.length - 1) return; // hold on the last stage until the real result arrives
    setStepState(stepEls[current], "done");
    current += 1;
    setStepState(stepEls[current], "active");
  };

  return { list, advance };
}

export function renderLoader(targetLabel) {
  const wrapper = document.createElement("div");
  wrapper.className = "aeo-geo-widget__loader";

  wrapper.appendChild(renderScanFrame(targetLabel));

  const { list, advance } = renderStageStepper();
  wrapper.appendChild(list);

  const intervalId = setInterval(() => {
    if (!document.body.contains(wrapper)) {
      clearInterval(intervalId);
      return;
    }
    advance();
  }, STAGE_INTERVAL_MS);

  return wrapper;
}
