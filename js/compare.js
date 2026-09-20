import { rackets } from "../data/index.js";

/* =========================================================
   SETTINGS
========================================================= */

const MAX_SELECTION = 4;

const radarAxes = [
    { key: "smashPower", label: "Smash" },
    { key: "swingSpeed", label: "Speed" },
    { key: "defense", label: "Defense" },
    { key: "control", label: "Control" },
    { key: "repulsion", label: "Repulsion" },
    { key: "stability", label: "Stability" },
    { key: "headHeavy", label: "Head Heavy" }
];

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

const racketColors = [
  "#2563eb", // 1st racket - Blue
  "#dc2626", // 2nd racket - Red
  "#16a34a", // 3rd racket - Green
  "#9333ea"  // 4th racket - Purple
];


/* =========================================================
   STATE
========================================================= */

let selectedRackets = [];
let currentBrand = "All";


/* =========================================================
   ELEMENTS
========================================================= */

const searchInput =
    document.getElementById("racket-search");

const selectorList =
    document.getElementById("racket-selector-list");

const selectedContainer =
    document.getElementById("selected-rackets");

const selectedEmpty =
    document.getElementById("selected-empty");

const comparisonArea =
    document.getElementById("comparison-area");

const radarCanvas =
    document.getElementById("radar-chart");

const radarLegend =
    document.getElementById("radar-legend");

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

    if (!searchInput || !selectorList) {
        console.error(
            "Compare page elements were not found."
        );

        return;
    }

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
                    button.dataset.brand || "All";

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

            if (selectedRackets.length >= 2) {
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

            const balance =
                racket.officialSpecs?.balance || "";

            const shaft =
                racket.officialSpecs?.shaftStiffness || "";

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
                            ${escapeHTML(racket.model || "")}
                        </strong>

                        <div class="selector-meta">

                            ${
                                balance
                                    ? `<span>${escapeHTML(balance)}</span>`
                                    : ""
                            }

                            ${
                                shaft
                                    ? `<span>${escapeHTML(shaft)}</span>`
                                    : ""
                            }

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
   TOGGLE RACKET
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
   SELECTED RACKETS
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
                                ${escapeHTML(racket.model || "")}
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
                event => {

                    event.stopPropagation();

                    toggleRacket(
                        button.dataset.remove
                    );

                }
            );

        });
}


/* =========================================================
   UPDATE COMPARISON
========================================================= */

function updateComparison() {

    const enoughRackets =
        selectedRackets.length >= 2;


    if (enoughRackets) {

        comparisonArea.classList.remove("hidden");

        selectedEmpty.classList.add("hidden");

    } else {

        comparisonArea.classList.add("hidden");

        selectedEmpty.classList.remove("hidden");

    }


    renderRadar();

    renderLegend();

    renderCharacteristics();

    renderSpecs();
}


/* =========================================================
   RADAR
========================================================= */

function renderRadar() {

    if (!radarCanvas) {
        return;
    }


    const rect =
        radarCanvas.getBoundingClientRect();

    const cssWidth =
        Math.max(rect.width, 300);

    const cssHeight =
        Math.max(rect.height, 350);

    const dpr =
        window.devicePixelRatio || 1;


    radarCanvas.width =
        Math.round(cssWidth * dpr);

    radarCanvas.height =
        Math.round(cssHeight * dpr);


    const ctx =
        radarCanvas.getContext("2d");

    if (!ctx) {
        return;
    }


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


    /* Empty */

    if (selectedRackets.length < 2) {

        drawEmptyRadar(
            ctx,
            cssWidth,
            cssHeight
        );

        return;
    }


    /* Grid */

    ctx.save();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#d8d8d5";
    ctx.fillStyle = "#fafaf8";


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


    /* Axes */

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
            "#d8d8d5";

        ctx.stroke();
    }


    ctx.restore();


    /* Axis labels */

    ctx.save();

    ctx.font =
        "600 13px Arial";

    ctx.fillStyle =
        "#555";

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
                hexToRGBA(
                    color,
                    0.12
                );

            ctx.fill();


            ctx.strokeStyle =
                color;

            ctx.lineWidth =
                2.5;

            ctx.stroke();


            /* Points */

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
                        "#fff";

                    ctx.lineWidth =
                        1.5;

                    ctx.stroke();

                }
            );


            ctx.restore();

        }
    );


    /* Scale */

    ctx.save();

    ctx.font =
        "11px Arial";

    ctx.fillStyle =
        "#999";

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
            width * 0.30,
            height * 0.30,
            190
        );

    const axisCount =
        radarAxes.length;

    const startAngle =
        -Math.PI / 2;


    ctx.save();

    ctx.strokeStyle =
        "#d8d8d5";

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
        "#777";

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
        "#999";


    ctx.fillText(
        "Select at least 2 rackets",
        centerX,
        centerY
    );


    ctx.restore();
}


/* =========================================================
   LEGEND
========================================================= */

function renderLegend() {

    if (
        selectedRackets.length < 2
    ) {

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
   CHARACTERISTICS TABLE
========================================================= */

function renderCharacteristics() {

    if (
        selectedRackets.length < 2
    ) {

        characteristicHead.innerHTML = `
            <th>
                Characteristic
            </th>
        `;

        characteristicBody.innerHTML = "";

        return;
    }


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
                                <td class="characteristic-cell">

                                    <span class="value-number">
                                        ${formatNumber(value)}
                                    </span>

                                    <div class="value-bar">

                                        <span
                                            class="value-bar-fill"
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
   SPECIFICATIONS TABLE
========================================================= */

function renderSpecs() {

    if (
        selectedRackets.length < 2
    ) {

        specHead.innerHTML = `
            <th>
                Specification
            </th>
        `;

        specBody.innerHTML = "";

        return;
    }


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
                                <td class="spec-value">
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
   TABLE HEADER
========================================================= */

function renderTableRacketHeader(racket) {

    return `
        <div class="table-racket-header">

            <img
                class="table-racket-image"
                src="${safeAttribute(racket.image)}"
                alt="${escapeHTML(racket.model)}"
                onerror="this.style.visibility='hidden'"
            >

            <div class="table-racket-info">

                <div class="table-racket-name">
                    ${escapeHTML(racket.model)}
                </div>

                <div class="table-racket-brand">
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


function formatSpecificationValue(value) {

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


    return `
        rgba(
            ${r},
            ${g},
            ${b},
            ${alpha}
        )
    `;
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
