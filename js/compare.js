import { rackets } from "../data/index.js";


const MAX_SELECTION = 4;

let selectedRackets = [];


const selector = document.getElementById("racket-selector");
const selectedContainer = document.getElementById("selected-rackets");
const comparisonArea = document.getElementById("comparison-area");
const emptyState = document.getElementById("compare-empty");
const selectionCount = document.getElementById("selection-count");

const radarChart = document.getElementById("radar-chart");
const radarLegend = document.getElementById("radar-legend");

const characteristicHead =
    document.getElementById("characteristic-head");

const characteristicBody =
    document.getElementById("characteristic-body");

const specHead =
    document.getElementById("spec-head");

const specBody =
    document.getElementById("spec-body");


/* =========================
   INITIALIZE
========================= */

renderSelector();
updateComparison();


/* =========================
   RACKET SELECTOR
========================= */

function renderSelector() {

    selector.innerHTML = rackets.map(racket => {

        const isSelected =
            selectedRackets.some(
                selected => selected.id === racket.id
            );

        return `
            <button
                class="selector-card ${isSelected ? "selected" : ""}"
                data-id="${racket.id}"
            >

                <div class="selector-image">

                    <img
                        src="${racket.image}"
                        alt="${racket.model}"
                    >

                </div>

                <div class="selector-info">

                    <span class="selector-brand">
                        ${racket.brand}
                    </span>

                    <strong>
                        ${racket.model}
                    </strong>

                </div>

                <div class="selector-check">
                    ${isSelected ? "✓" : "+"}
                </div>

            </button>
        `;

    }).join("");


    document
        .querySelectorAll(".selector-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                const id = card.dataset.id;

                toggleRacket(id);

            });

        });

}


/* =========================
   SELECT / REMOVE
========================= */

function toggleRacket(id) {

    const existingIndex =
        selectedRackets.findIndex(
            racket => racket.id === id
        );


    if (existingIndex !== -1) {

        selectedRackets.splice(existingIndex, 1);

    } else {

        if (selectedRackets.length >= MAX_SELECTION) {

            return;

        }

        const racket =
            rackets.find(item => item.id === id);

        if (racket) {

            selectedRackets.push(racket);

        }

    }


    renderSelector();
    updateComparison();

}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateComparison() {

    selectionCount.textContent =
        `${selectedRackets.length} / ${MAX_SELECTION}`;


    renderSelectedRackets();


    if (selectedRackets.length >= 2) {

        comparisonArea.classList.remove("hidden");
        emptyState.classList.add("hidden");

        renderRadarChart();
        renderCharacteristicTable();
        renderSpecTable();

    } else {

        comparisonArea.classList.add("hidden");
        emptyState.classList.remove("hidden");

    }

}


/* =========================
   SELECTED RACKET CARDS
========================= */

function renderSelectedRackets() {

    if (selectedRackets.length === 0) {

        selectedContainer.innerHTML = `
            <div class="selected-placeholder">
                No rackets selected yet.
            </div>
        `;

        return;

    }


    selectedContainer.innerHTML =
        selectedRackets.map(racket => {

            return `
                <div class="selected-racket-card">

                    <div class="selected-racket-image">

                        <img
                            src="${racket.image}"
                            alt="${racket.model}"
                        >

                    </div>

                    <div class="selected-racket-info">

                        <span>
                            ${racket.brand}
                        </span>

                        <h3>
                            ${racket.model}
                        </h3>

                    </div>

                    <button
                        class="remove-racket"
                        data-id="${racket.id}"
                        aria-label="Remove ${racket.model}"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");


    document
        .querySelectorAll(".remove-racket")
        .forEach(button => {

            button.addEventListener("click", () => {

                toggleRacket(button.dataset.id);

            });

        });

}


/* =========================
   RADAR CHART
========================= */

function renderRadarChart() {

    const axes = [

        {
            key: "smashPower",
            label: "Smash"
        },

        {
            key: "swingSpeed",
            label: "Speed"
        },

        {
            key: "defense",
            label: "Defense"
        },

        {
            key: "control",
            label: "Control"
        },

        {
            key: "stability",
            label: "Stability"
        },

        {
            key: "repulsion",
            label: "Repulsion"
        }

    ];


    const center = 300;
    const radius = 210;

    const angleStep =
        (Math.PI * 2) / axes.length;


    radarChart.innerHTML = "";


    /* Background circles */

    for (let level = 2; level <= 10; level += 2) {

        const r =
            radius * (level / 10);

        const points =
            axes.map((axis, index) => {

                const angle =
                    index * angleStep - Math.PI / 2;

                const x =
                    center + Math.cos(angle) * r;

                const y =
                    center + Math.sin(angle) * r;

                return `${x},${y}`;

            }).join(" ");


        radarChart.innerHTML += `
            <polygon
                points="${points}"
                class="radar-grid"
            />
        `;

    }


    /* Axis lines */

    axes.forEach((axis, index) => {

        const angle =
            index * angleStep - Math.PI / 2;

        const x =
            center + Math.cos(angle) * radius;

        const y =
            center + Math.sin(angle) * radius;


        radarChart.innerHTML += `
            <line
                x1="${center}"
                y1="${center}"
                x2="${x}"
                y2="${y}"
                class="radar-axis"
            />
        `;


        const labelDistance = radius + 32;

        const labelX =
            center + Math.cos(angle) * labelDistance;

        const labelY =
            center + Math.sin(angle) * labelDistance;


        radarChart.innerHTML += `
            <text
                x="${labelX}"
                y="${labelY}"
                class="radar-label"
                text-anchor="middle"
                dominant-baseline="middle"
            >
                ${axis.label}
            </text>
        `;

    });


    /* Racket polygons */

    selectedRackets.forEach((racket, racketIndex) => {

        const points =
            axes.map((axis, index) => {

                const value =
                    racket.characteristics[axis.key] || 0;

                const r =
                    radius * (value / 10);

                const angle =
                    index * angleStep - Math.PI / 2;

                const x =
                    center + Math.cos(angle) * r;

                const y =
                    center + Math.sin(angle) * r;

                return `${x},${y}`;

            }).join(" ");


        radarChart.innerHTML += `
            <polygon
                points="${points}"
                class="radar-data radar-${racketIndex}"
            />
        `;

    });


    renderRadarLegend();

}


/* =========================
   RADAR LEGEND
========================= */

function renderRadarLegend() {

    radarLegend.innerHTML =
        selectedRackets.map((racket, index) => {

            return `
                <div class="radar-legend-item">

                    <span
                        class="legend-dot legend-${index}"
                    ></span>

                    <span>
                        ${racket.model}
                    </span>

                </div>
            `;

        }).join("");

}


/* =========================
   CHARACTERISTIC TABLE
========================= */

function renderCharacteristicTable() {

    const characteristics = [

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


    characteristicHead.innerHTML = `
        <tr>

            <th>Characteristic</th>

            ${selectedRackets.map(racket => `
                <th>
                    ${racket.model}
                </th>
            `).join("")}

        </tr>
    `;


    characteristicBody.innerHTML =
        characteristics.map(([label, key]) => {

            const values =
                selectedRackets.map(
                    racket =>
                        racket.characteristics[key] ?? "—"
                );


            const numericValues =
                values.filter(
                    value => typeof value === "number"
                );


            const max =
                numericValues.length
                    ? Math.max(...numericValues)
                    : null;


            return `
                <tr>

                    <td>
                        ${label}
                    </td>

                    ${values.map(value => {

                        const isHighest =
                            value === max &&
                            numericValues.length > 1;

                        return `
                            <td
                                class="${isHighest ? "comparison-highest" : ""}"
                            >

                                <strong>
                                    ${value}
                                </strong>

                                ${
                                    typeof value === "number"
                                    ? `
                                        <div class="table-bar">
                                            <span
                                                style="width:${value * 10}%"
                                            ></span>
                                        </div>
                                      `
                                    : ""
                                }

                            </td>
                        `;

                    }).join("")}

                </tr>
            `;

        }).join("");

}


/* =========================
   OFFICIAL SPEC TABLE
========================= */

function renderSpecTable() {

    const specs = [

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


    specHead.innerHTML = `
        <tr>

            <th>Specification</th>

            ${selectedRackets.map(racket => `
                <th>
                    ${racket.model}
                </th>
            `).join("")}

        </tr>
    `;


    specBody.innerHTML =
        specs.map(([label, key]) => {

            return `
                <tr>

                    <td>
                        ${label}
                    </td>

                    ${selectedRackets.map(racket => {

                        const value =
                            racket.officialSpecs?.[key] || "—";

                        return `
                            <td>
                                ${value}
                            </td>
                        `;

                    }).join("")}

                </tr>
            `;

        }).join("");

}
