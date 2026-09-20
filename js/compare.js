import { rackets } from "../data/index.js";


const MAX_SELECTION = 4;

let selectedRackets = [];

let currentBrand = "All";


// =========================
// ELEMENTS
// =========================

const searchInput =
    document.getElementById("compare-search");

const selector =
    document.getElementById("racket-selector");

const selectedContainer =
    document.getElementById("selected-rackets");

const comparisonArea =
    document.getElementById("comparison-area");

const emptyState =
    document.getElementById("compare-empty");

const selectionCount =
    document.getElementById("selection-count");

const radarChart =
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

const filterButtons =
    document.querySelectorAll(".compare-filter");


// =========================
// INITIAL RENDER
// =========================

renderSelector();

renderSelected();

updateComparison();


// =========================
// SEARCH
// =========================

searchInput.addEventListener("input", () => {

    renderSelector();

});


// =========================
// BRAND FILTER
// =========================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentBrand =
            button.dataset.brand;

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderSelector();

    });

});


// =========================
// RENDER SELECTOR
// =========================

function renderSelector() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        rackets.filter(racket => {

            const matchesSearch =
                racket.model
                    .toLowerCase()
                    .includes(search) ||

                racket.brand
                    .toLowerCase()
                    .includes(search) ||

                racket.series
                    .toLowerCase()
                    .includes(search);


            const matchesBrand =
                currentBrand === "All" ||
                racket.brand === currentBrand;


            return matchesSearch && matchesBrand;

        });


    selector.innerHTML = "";


    if (filtered.length === 0) {

        selector.innerHTML = `
            <div class="no-results">
                <strong>No rackets found</strong>
                <p>
                    Try another search or brand.
                </p>
            </div>
        `;

        return;

    }


    filtered.forEach(racket => {

        const isSelected =
            selectedRackets.some(
                selected =>
                    selected.id === racket.id
            );


        const card =
            document.createElement("button");


        card.className =
            "selector-list-item";


        if (isSelected) {
            card.classList.add("selected");
        }


        card.innerHTML = `

            <div class="selector-list-image">

                <img
                    src="${racket.image}"
                    alt="${racket.model}"
                >

            </div>


            <div class="selector-list-info">

                <span class="selector-brand">
                    ${racket.brand}
                </span>

                <strong>
                    ${racket.model}
                </strong>

                <div class="selector-meta">

                    <span>
                        ${racket.officialSpecs.balance || "—"}
                    </span>

                    <span>
                        ${racket.officialSpecs.weight || "—"}
                    </span>

                </div>

            </div>


            <div class="selector-add">

                ${isSelected ? "✓" : "+"}

            </div>

        `;


        card.addEventListener("click", () => {

            toggleRacket(racket);

        });


        selector.appendChild(card);

    });

}


// =========================
// SELECT / REMOVE
// =========================

function toggleRacket(racket) {

    const index =
        selectedRackets.findIndex(
            selected =>
                selected.id === racket.id
        );


    // Already selected
    if (index !== -1) {

        selectedRackets.splice(index, 1);

    }

    // New selection
    else {

        if (
            selectedRackets.length >=
            MAX_SELECTION
        ) {

            return;

        }

        selectedRackets.push(racket);

    }


    renderSelector();

    renderSelected();

    updateComparison();

}


// =========================
// SELECTED RACKETS
// =========================

function renderSelected() {

    selectedContainer.innerHTML = "";


    if (selectedRackets.length === 0) {

        selectedContainer.innerHTML = `

            <div class="selected-placeholder">

                No rackets selected yet.

            </div>

        `;

    }


    selectedRackets.forEach(
        (racket, index) => {

            const card =
                document.createElement("div");


            card.className =
                "selected-racket-card";


            card.innerHTML = `

                <div class="
                    selected-racket-color
                    selected-color-${index}
                "></div>


                <div class="
                    selected-racket-image
                ">

                    <img
                        src="${racket.image}"
                        alt="${racket.model}"
                    >

                </div>


                <div class="
                    selected-racket-info
                ">

                    <span>
                        ${racket.brand}
                    </span>

                    <h3>
                        ${racket.model}
                    </h3>

                </div>


                <button
                    class="remove-racket"
                    aria-label="Remove ${racket.model}"
                >
                    ×
                </button>

            `;


            card
                .querySelector(".remove-racket")
                .addEventListener(
                    "click",
                    () => {

                        selectedRackets.splice(
                            index,
                            1
                        );

                        renderSelector();

                        renderSelected();

                        updateComparison();

                    }
                );


            selectedContainer.appendChild(card);

        }
    );


    selectionCount.textContent =
        `${selectedRackets.length} / ${MAX_SELECTION} selected`;

}


// =========================
// COMPARISON VISIBILITY
// =========================

function updateComparison() {

    if (selectedRackets.length >= 2) {

        comparisonArea.classList.remove(
            "hidden"
        );

        emptyState.classList.add(
            "hidden"
        );

        renderRadar();

        renderCharacteristics();

        renderSpecs();

    }

    else {

        comparisonArea.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

    }

}


// =========================
// RADAR CHART
// =========================

const radarAxes = [

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


function renderRadar() {

    const centerX = 350;

    const centerY = 300;

    const radius = 190;

    const levels = 5;

    const angleStep =
        (Math.PI * 2) /
        radarAxes.length;


    radarChart.innerHTML = "";


    // =========================
    // GRID
    // =========================

    for (
        let level = 1;
        level <= levels;
        level++
    ) {

        const points =
            radarAxes.map(
                (_, index) => {

                    const value =
                        radius *
                        (level / levels);

                    const angle =
                        index *
                        angleStep -
                        Math.PI / 2;

                    const x =
                        centerX +
                        Math.cos(angle) *
                        value;

                    const y =
                        centerY +
                        Math.sin(angle) *
                        value;

                    return `${x},${y}`;

                }
            ).join(" ");


        radarChart.innerHTML += `

            <polygon
                points="${points}"
                class="radar-grid"
            />

        `;

    }


    // =========================
    // AXES
    // =========================

    radarAxes.forEach(
        (axis, index) => {

            const angle =
                index *
                angleStep -
                Math.PI / 2;


            const x =
                centerX +
                Math.cos(angle) *
                radius;

            const y =
                centerY +
                Math.sin(angle) *
                radius;


            radarChart.innerHTML += `

                <line
                    x1="${centerX}"
                    y1="${centerY}"
                    x2="${x}"
                    y2="${y}"
                    class="radar-axis"
                />

            `;


            const labelDistance =
                radius + 35;


            const labelX =
                centerX +
                Math.cos(angle) *
                labelDistance;


            const labelY =
                centerY +
                Math.sin(angle) *
                labelDistance;


            radarChart.innerHTML += `

                <text
                    x="${labelX}"
                    y="${labelY}"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    class="radar-label"
                >
                    ${axis.label}
                </text>

            `;

        }
    );


    // =========================
    // DATA
    // =========================

    selectedRackets.forEach(
        (racket, racketIndex) => {

            const points =
                radarAxes.map(
                    (axis, index) => {

                        const value =
                            racket.characteristics[
                                axis.key
                            ] || 0;


                        const scaled =
                            radius *
                            (value / 10);


                        const angle =
                            index *
                            angleStep -
                            Math.PI / 2;


                        const x =
                            centerX +
                            Math.cos(angle) *
                            scaled;


                        const y =
                            centerY +
                            Math.sin(angle) *
                            scaled;


                        return `${x},${y}`;

                    }
                ).join(" ");


            radarChart.innerHTML += `

                <polygon
                    points="${points}"
                    class="
                        radar-data
                        radar-${racketIndex}
                    "
                />

            `;

        }
    );


    // =========================
    // LEGEND
    // =========================

    radarLegend.innerHTML = "";


    selectedRackets.forEach(
        (racket, index) => {

            radarLegend.innerHTML += `

                <div class="radar-legend-item">

                    <span
                        class="
                            legend-dot
                            legend-${index}
                        "
                    ></span>

                    <span>
                        ${racket.model}
                    </span>

                </div>

            `;

        }
    );

}


// =========================
// CHARACTERISTICS TABLE
// =========================

function renderCharacteristics() {

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


    characteristicHead.innerHTML =
        "<th>Characteristic</th>";


    selectedRackets.forEach(
        (racket, index) => {

            characteristicHead.innerHTML += `

                <th>

                    <strong>
                        ${racket.model}
                    </strong>

                </th>

            `;

        }
    );


    characteristicBody.innerHTML = "";


    characteristics.forEach(
        ([label, key]) => {

            const row =
                document.createElement("tr");


            let html =
                `<td>${label}</td>`;


            selectedRackets.forEach(
                racket => {

                    const value =
                        racket.characteristics[key] ?? 0;


                    html += `

                        <td>

                            <strong>
                                ${value}/10
                            </strong>

                            <div class="table-bar">

                                <span
                                    style="
                                        width:${value * 10}%;
                                    "
                                ></span>

                            </div>

                        </td>

                    `;

                }
            );


            row.innerHTML = html;

            characteristicBody.appendChild(row);

        }
    );

}


// =========================
// OFFICIAL SPECS
// =========================

function renderSpecs() {

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


    specHead.innerHTML =
        "<th>Specification</th>";


    selectedRackets.forEach(
        racket => {

            specHead.innerHTML += `

                <th>
                    ${racket.model}
                </th>

            `;

        }
    );


    specBody.innerHTML = "";


    specs.forEach(
        ([label, key]) => {

            const row =
                document.createElement("tr");


            let html =
                `<td>${label}</td>`;


            selectedRackets.forEach(
                racket => {

                    const value =
                        racket.officialSpecs[key] ||
                        "—";


                    html += `

                        <td>
                            ${value}
                        </td>

                    `;

                }
            );


            row.innerHTML = html;

            specBody.appendChild(row);

        }
    );

}
