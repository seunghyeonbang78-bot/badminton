import { rackets } from "../data/index.js";

/* =========================================================
   SETTINGS
========================================================= */

const MAX_SELECTION = 4;

/*
  DO NOT CHANGE
  These are the 7 axes used by the current radar chart.
*/
const radarAxes = [
  { key: "smashPower", label: "Smash" },
  { key: "swingSpeed", label: "Speed" },
  { key: "defense", label: "Defense" },
  { key: "control", label: "Control" },
  { key: "repulsion", label: "Repulsion" },
  { key: "stability", label: "Stability" },
  { key: "headHeavy", label: "Head Heavy" }
];

/*
  Full characteristics table.
*/
const characteristicRows = [
  ["Head Heavy", "headHeavy"],
  ["Smash Power", "smashPower"],
  ["Swing Speed", "swingSpeed"],
  ["Defense", "defense"],
  ["Control", "control"],
  ["Repulsion", "repulsion"],
  ["Stability", "stability"],
  ["Maneuverability", "maneuverability"],
  ["Holding", "holding"],
  ["Touch", "touch"],
  ["Precision", "precision"]
];

/*
  Official specifications table.
*/
const specificationRows = [
  ["Weight", "weight"],
  ["Grip", "grip"],
  ["Balance", "balance"],
  ["Shaft Stiffness", "shaftStiffness"],
  ["Length", "length"],
  ["Max Tension", "maxTension"],
  ["Frame Material", "frameMaterial"],
  ["Shaft Material", "shaftMaterial"],
  ["Release Year", "releaseYear"]
];

/*
  CURRENT RADAR COLORS.
  DO NOT CHANGE.
*/
const racketColors = [
  "#111827",
  "#2563eb",
  "#dc2626",
  "#16a34a"
];

let selectedRackets = [];
let currentBrand = "All";

/* =========================================================
   ELEMENTS
   IMPORTANT:
   These IDs match the CURRENT compare.html
========================================================= */

const searchInput =
  document.getElementById("compare-search");

const selectorList =
  document.getElementById("racket-selector");

const selectedContainer =
  document.getElementById("selected-rackets");

const radarCanvas =
  document.getElementById("radar-chart");

const radarLegend =
  document.getElementById("radar-legend");

const comparisonArea =
  document.getElementById("comparison-area");

const emptyState =
  document.getElementById("compare-empty");

const characteristicHead =
  document.getElementById("characteristic-head");

const characteristicBody =
  document.getElementById("characteristic-body");

const specHead =
  document.getElementById("spec-head");

const specBody =
  document.getElementById("spec-body");

const brandButtons =
  document.querySelectorAll(".compare-filter");

const selectionCount =
  document.getElementById("selection-count");

/* =========================================================
   INITIALIZATION
========================================================= */

function init() {

  renderSelector();

  renderSelectedRackets();

  updateComparison();

  searchInput.addEventListener(
    "input",
    renderSelector
  );

  brandButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        currentBrand =
          button.dataset.brand;

        brandButtons.forEach(btn => {
          btn.classList.remove("active");
        });

        button.classList.add("active");

        renderSelector();
      }
    );

  });

  window.addEventListener(
    "resize",
    () => {

      if (selectedRackets.length > 0) {
        renderRadar();
      }

    }
  );
}

init();

/* =========================================================
   SELECTOR
========================================================= */

function renderSelector() {

  const searchTerm =
    searchInput.value
      .trim()
      .toLowerCase();

  const filtered =
    rackets.filter(racket => {

      const matchesBrand =
        currentBrand === "All" ||
        racket.brand === currentBrand;

      const searchableText = [
        racket.model,
        racket.brand,
        racket.series
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(searchTerm);

      return matchesBrand && matchesSearch;
    });

  if (filtered.length === 0) {

    selectorList.innerHTML = `
      <div class="no-results">
        No rackets found.
      </div>
    `;

    updateSelectionCount();

    return;
  }

  selectorList.innerHTML =
    filtered.map(racket => {

      const selected =
        selectedRackets.some(
          selectedRacket =>
            selectedRacket.model === racket.model
        );

      const disabled =
        !selected &&
        selectedRackets.length >= MAX_SELECTION;

      return `
        <div
          class="
            selector-list-item
            ${selected ? "selected" : ""}
            ${disabled ? "disabled" : ""}
          "
          data-model="${safeAttribute(racket.model)}"
        >

          <div class="selector-list-image">

            <img
              src="${safeAttribute(racket.image)}"
              alt="${escapeHTML(racket.model)}"
              onerror="this.style.visibility='hidden'"
            >

          </div>

          <div class="selector-list-info">

            <span class="selector-brand">
              ${escapeHTML(racket.brand || "")}
            </span>

            <strong>
              ${escapeHTML(racket.model)}
            </strong>

            <div class="selector-meta">

              <span>
                ${escapeHTML(
                  racket.officialSpecs?.balance || ""
                )}
              </span>

              <span>
                ${escapeHTML(
                  racket.officialSpecs?.shaftStiffness || ""
                )}
              </span>

            </div>

          </div>

          <div class="selector-add">

            ${selected ? "✓" : "+"}

          </div>

        </div>
      `;

    }).join("");

  selectorList
    .querySelectorAll(".selector-list-item")
    .forEach(item => {

      item.addEventListener(
        "click",
        () => {

          if (
            item.classList.contains("disabled")
          ) {
            return;
          }

          toggleRacket(
            item.dataset.model
          );

        }
      );

    });

  updateSelectionCount();
}

/* =========================================================
   SELECTION COUNT
========================================================= */

function updateSelectionCount() {

  selectionCount.textContent =
    `${selectedRackets.length} / ${MAX_SELECTION} selected`;
}

/* =========================================================
   SELECT / REMOVE RACKET
========================================================= */

function toggleRacket(model) {

  const index =
    selectedRackets.findIndex(
      racket =>
        racket.model === model
    );

  if (index !== -1) {

    selectedRackets.splice(index, 1);

  } else {

    if (
      selectedRackets.length >= MAX_SELECTION
    ) {
      return;
    }

    const racket =
      rackets.find(
        racket =>
          racket.model === model
      );

    if (!racket) {
      return;
    }

    selectedRackets.push(racket);
  }

  renderSelector();

  renderSelectedRackets();

  updateComparison();
}

/* =========================================================
   SELECTED RACKET CARDS
========================================================= */

function renderSelectedRackets() {

  if (selectedRackets.length === 0) {

    selectedContainer.innerHTML = `
      <div class="selected-placeholder">
        Select rackets above to compare them.
      </div>
    `;

    return;
  }

  selectedContainer.innerHTML =
    selectedRackets.map(
      (racket, index) => {

        const color =
          racketColors[
            index % racketColors.length
          ];

        return `
          <div class="selected-racket-card">

            <div
              class="selected-racket-color"
              style="background:${color}"
            ></div>

            <div class="selected-racket-image">

              <img
                src="${safeAttribute(racket.image)}"
                alt="${escapeHTML(racket.model)}"
                onerror="this.style.visibility='hidden'"
              >

            </div>

            <div class="selected-racket-info">

              <span>
                ${escapeHTML(racket.brand || "")}
              </span>

              <h3>
                ${escapeHTML(racket.model)}
              </h3>

            </div>

            <button
              class="remove-racket"
              data-remove="${safeAttribute(racket.model)}"
              aria-label="Remove ${escapeHTML(racket.model)}"
            >
              ×
            </button>

          </div>
        `;

      }
    ).join("");

  selectedContainer
    .querySelectorAll(".remove-racket")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          toggleRacket(
            button.dataset.remove
          );

        }
      );

    });
}

/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateComparison() {

  const shouldShowComparison =
    selectedRackets.length >= 2;

  if (shouldShowComparison) {

    comparisonArea.classList.remove("hidden");

    emptyState.classList.add("hidden");

  } else {

    comparisonArea.classList.add("hidden");

    emptyState.classList.remove("hidden");

  }

  renderRadar();

  renderLegend();

  renderCharacteristics();

  renderSpecs();
}

/* =========================================================
   RADAR CHART
   KEEP CURRENT GRAPH EXACTLY THE SAME
========================================================= */

function renderRadar() {

  const canvas =
    radarCanvas;

  const rect =
    canvas.getBoundingClientRect();

  const cssWidth =
    Math.max(rect.width, 300);

  const cssHeight =
    Math.max(rect.height, 350);

  const dpr =
    window.devicePixelRatio || 1;

  canvas.width =
    Math.round(cssWidth * dpr);

  canvas.height =
    Math.round(cssHeight * dpr);

  const ctx =
    canvas.getContext("2d");

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  ctx.clearRect(
    0,
    0,
    cssWidth,
    cssHeight
  );

  if (selectedRackets.length === 0) {

    drawEmptyRadar(
      ctx,
      cssWidth,
      cssHeight
    );

    return;
  }

  const centerX =
    cssWidth / 2;

  const centerY =
    cssHeight / 2;

  const radius =
    Math.min(
      cssWidth * 0.34,
      cssHeight * 0.34,
      210
    );

  const axisCount =
    radarAxes.length;

  const startAngle =
    -Math.PI / 2;

  ctx.save();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d1d5db";
  ctx.fillStyle = "#f9fafb";

  for (
    let level = 1;
    level <= 5;
    level++
  ) {

    const levelRadius =
      radius * (level / 5);

    ctx.beginPath();

    for (
      let i = 0;
      i < axisCount;
      i++
    ) {

      const angle =
        startAngle +
        (i * Math.PI * 2) /
          axisCount;

      const x =
        centerX +
        Math.cos(angle) *
          levelRadius;

      const y =
        centerY +
        Math.sin(angle) *
          levelRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

    }

    ctx.closePath();

    ctx.fill();

    ctx.stroke();
  }

  for (
    let i = 0;
    i < axisCount;
    i++
  ) {

    const angle =
      startAngle +
      (i * Math.PI * 2) /
        axisCount;

    const x =
      centerX +
      Math.cos(angle) *
        radius;

    const y =
      centerY +
      Math.sin(angle) *
        radius;

    ctx.beginPath();

    ctx.moveTo(
      centerX,
      centerY
    );

    ctx.lineTo(x, y);

    ctx.strokeStyle =
      "#d1d5db";

    ctx.stroke();
  }

  ctx.restore();

  /* Axis labels */

  ctx.save();

  ctx.font =
    "600 13px Arial";

  ctx.fillStyle =
    "#374151";

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  for (
    let i = 0;
    i < axisCount;
    i++
  ) {

    const angle =
      startAngle +
      (i * Math.PI * 2) /
        axisCount;

    const labelDistance =
      radius + 30;

    const x =
      centerX +
      Math.cos(angle) *
        labelDistance;

    const y =
      centerY +
      Math.sin(angle) *
        labelDistance;

    ctx.fillText(
      radarAxes[i].label,
      x,
      y
    );
  }

  ctx.restore();

  /* Racket polygons */

  selectedRackets.forEach(
    (racket, racketIndex) => {

      const color =
        racketColors[
          racketIndex %
          racketColors.length
        ];

      ctx.save();

      ctx.beginPath();

      radarAxes.forEach(
        (axis, axisIndex) => {

          const value =
            getCharacteristicValue(
              racket,
              axis.key
            );

          const normalized =
            Math.max(
              0,
              Math.min(
                10,
                value
              )
            ) / 10;

          const angle =
            startAngle +
            (axisIndex * Math.PI * 2) /
              axisCount;

          const pointRadius =
            radius * normalized;

          const x =
            centerX +
            Math.cos(angle) *
              pointRadius;

          const y =
            centerY +
            Math.sin(angle) *
              pointRadius;

          if (axisIndex === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

        }
      );

      ctx.closePath();

      ctx.fillStyle =
        hexToRGBA(color, 0.16);

      ctx.fill();

      ctx.strokeStyle =
        color;

      ctx.lineWidth = 2.5;

      ctx.stroke();

      radarAxes.forEach(
        (axis, axisIndex) => {

          const value =
            getCharacteristicValue(
              racket,
              axis.key
            );

          const normalized =
            Math.max(
              0,
              Math.min(
                10,
                value
              )
            ) / 10;

          const angle =
            startAngle +
            (axisIndex * Math.PI * 2) /
              axisCount;

          const pointRadius =
            radius * normalized;

          const x =
            centerX +
            Math.cos(angle) *
              pointRadius;

          const y =
            centerY +
            Math.sin(angle) *
              pointRadius;

          ctx.beginPath();

          ctx.arc(
            x,
            y,
            4,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            color;

          ctx.fill();

          ctx.strokeStyle =
            "#ffffff";

          ctx.lineWidth = 1.5;

          ctx.stroke();
        }
      );

      ctx.restore();
    }
  );

  /* Scale labels */

  ctx.save();

  ctx.font =
    "11px Arial";

  ctx.fillStyle =
    "#9ca3af";

  ctx.textAlign =
    "left";

  ctx.textBaseline =
    "middle";

  for (
    let level = 1;
    level <= 5;
    level++
  ) {

    const levelRadius =
      radius * (level / 5);

    ctx.fillText(
      String(level * 2),
      centerX + 5,
      centerY - levelRadius
    );
  }

  ctx.restore();
}

/* =========================================================
   EMPTY RADAR
========================================================= */

function drawEmptyRadar(
  ctx,
  width,
  height
) {

  const centerX =
    width / 2;

  const centerY =
    height / 2;

  const radius =
    Math.min(
      width * 0.3,
      height * 0.3,
      190
    );

  const axisCount =
    radarAxes.length;

  const startAngle =
    -Math.PI / 2;

  ctx.save();

  ctx.strokeStyle =
    "#d1d5db";

  ctx.lineWidth = 1;

  for (
    let level = 1;
    level <= 5;
    level++
  ) {

    const levelRadius =
      radius * (level / 5);

    ctx.beginPath();

    for (
      let i = 0;
      i < axisCount;
      i++
    ) {

      const angle =
        startAngle +
        (i * Math.PI * 2) /
          axisCount;

      const x =
        centerX +
        Math.cos(angle) *
          levelRadius;

      const y =
        centerY +
        Math.sin(angle) *
          levelRadius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

    }

    ctx.closePath();

    ctx.stroke();
  }

  for (
    let i = 0;
    i < axisCount;
    i++
  ) {

    const angle =
      startAngle +
      (i * Math.PI * 2) /
        axisCount;

    const x =
      centerX +
      Math.cos(angle) *
        radius;

    const y =
      centerY +
      Math.sin(angle) *
        radius;

    ctx.beginPath();

    ctx.moveTo(
      centerX,
      centerY
    );

    ctx.lineTo(x, y);

    ctx.stroke();
  }

  ctx.font =
    "600 13px Arial";

  ctx.fillStyle =
    "#6b7280";

  ctx.textAlign =
    "center";

  ctx.textBaseline =
    "middle";

  radarAxes.forEach(
    (axis, index) => {

      const angle =
        startAngle +
        (index * Math.PI * 2) /
          axisCount;

      const labelDistance =
        radius + 28;

      const x =
        centerX +
        Math.cos(angle) *
          labelDistance;

      const y =
        centerY +
        Math.sin(angle) *
          labelDistance;

      ctx.fillText(
        axis.label,
        x,
        y
      );
    }
  );

  ctx.font =
    "14px Arial";

  ctx.fillStyle =
    "#9ca3af";

  ctx.fillText(
    "Select rackets to compare",
    centerX,
    centerY
  );

  ctx.restore();
}

/* =========================================================
   LEGEND
========================================================= */

function renderLegend() {

  if (selectedRackets.length === 0) {

    radarLegend.innerHTML = "";

    return;
  }

  radarLegend.innerHTML =
    selectedRackets.map(
      (racket, index) => {

        const color =
          racketColors[
            index %
            racketColors.length
          ];

        return `
          <div class="radar-legend-item">

            <span
              class="legend-dot"
              style="background:${color}"
            ></span>

            <div class="legend-image">

              <img
                src="${safeAttribute(racket.image)}"
                alt="${escapeHTML(racket.model)}"
                onerror="this.style.visibility='hidden'"
              >

            </div>

            <div class="legend-name">
              ${escapeHTML(racket.model)}
            </div>

          </div>
        `;
      }
    ).join("");
}

/* =========================================================
   CHARACTERISTICS COMPARISON TABLE
   ONLY THIS TABLE'S CONTENT WAS CHANGED
========================================================= */

function renderCharacteristics() {

  if (selectedRackets.length === 0) {

    characteristicHead.innerHTML = `
      <th>
        Characteristic
      </th>
    `;

    characteristicBody.innerHTML = "";

    return;
  }

  /*
    Header:
    Characteristic | Racket 1 | Racket 2 | Racket 3 | Racket 4
  */

  characteristicHead.innerHTML = `
    <th>
      Characteristic
    </th>

    ${selectedRackets.map(
      racket => `
        <th>
          ${renderTableRacketHeader(racket)}
        </th>
      `
    ).join("")}
  `;

  characteristicBody.innerHTML =
    characteristicRows.map(
      ([label, key]) => {

        const cells =
          selectedRackets.map(
            racket => {

              const value =
                getCharacteristicValue(
                  racket,
                  key
                );

              const percentage =
                Math.max(
                  0,
                  Math.min(
                    100,
                    value * 10
                  )
                );

              return `
                <td class="characteristic-value">

                  ${formatNumber(value)}

                  <div class="table-bar">

                    <span
                      style="
                        width:${percentage}%;
                        background:${getRacketColor(racket)};
                      "
                    ></span>

                  </div>

                </td>
              `;
            }
          ).join("");

        return `
          <tr>

            <th scope="row">
              ${escapeHTML(label)}
            </th>

            ${cells}

          </tr>
        `;
      }
    ).join("");
}

/* =========================================================
   OFFICIAL SPECIFICATIONS COMPARISON TABLE
   ONLY THIS TABLE'S CONTENT WAS CHANGED
========================================================= */

function renderSpecs() {

  if (selectedRackets.length === 0) {

    specHead.innerHTML = `
      <th>
        Specification
      </th>
    `;

    specBody.innerHTML = "";

    return;
  }

  /*
    Header:
    Specification | Racket 1 | Racket 2 | Racket 3 | Racket 4
  */

  specHead.innerHTML = `
    <th>
      Specification
    </th>

    ${selectedRackets.map(
      racket => `
        <th>
          ${renderTableRacketHeader(racket)}
        </th>
      `
    ).join("")}
  `;

  specBody.innerHTML =
    specificationRows.map(
      ([label, key]) => {

        const cells =
          selectedRackets.map(
            racket => {

              const value =
                getSpecificationValue(
                  racket,
                  key
                );

              return `
                <td>
                  ${escapeHTML(
                    formatSpecificationValue(value)
                  )}
                </td>
              `;

            }
          ).join("");

        return `
          <tr>

            <th scope="row">
              ${escapeHTML(label)}
            </th>

            ${cells}

          </tr>
        `;
      }
    ).join("");
}

/* =========================================================
   TABLE RACKET HEADER
========================================================= */

function renderTableRacketHeader(racket) {

  return `
    <div
      style="
        display:flex;
        align-items:center;
        gap:10px;
        min-width:150px;
      "
    >

      <img
        src="${safeAttribute(racket.image)}"
        alt="${escapeHTML(racket.model)}"
        style="
          width:38px;
          height:48px;
          object-fit:contain;
          flex-shrink:0;
        "
        onerror="this.style.visibility='hidden'"
      >

      <div>

        <div
          style="
            font-weight:700;
            line-height:1.25;
          "
        >
          ${escapeHTML(racket.model)}
        </div>

        <div
          style="
            margin-top:3px;
            color:#6b7280;
            font-size:11px;
            font-weight:500;
          "
        >
          ${escapeHTML(racket.brand || "")}
        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   DATA HELPERS
========================================================= */

function getCharacteristicValue(
  racket,
  key
) {

  const value =
    racket?.characteristics?.[key];

  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

function getSpecificationValue(
  racket,
  key
) {

  return (
    racket?.officialSpecs?.[key] ??
    racket?.[key] ??
    ""
  );
}

/* =========================================================
   FORMATTING
========================================================= */

function formatNumber(value) {

  if (
    Number.isInteger(value)
  ) {
    return String(value);
  }

  return value
    .toFixed(1)
    .replace(/\.0$/, "");
}

function formatSpecificationValue(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  if (
    typeof value === "object"
  ) {
    return JSON.stringify(value);
  }

  return String(value);
}

/* =========================================================
   COLORS
========================================================= */

function getRacketColor(racket) {

  const index =
    selectedRackets.findIndex(
      selected =>
        selected.model === racket.model
    );

  if (index === -1) {
    return racketColors[0];
  }

  return racketColors[
    index % racketColors.length
  ];
}

function hexToRGBA(
  hex,
  alpha
) {

  const clean =
    hex.replace("#", "");

  const bigint =
    parseInt(clean, 16);

  const r =
    (bigint >> 16) & 255;

  const g =
    (bigint >> 8) & 255;

  const b =
    bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* =========================================================
   SECURITY / HTML HELPERS
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeAttribute(value) {

  return escapeHTML(value);
}
