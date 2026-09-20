import { rackets } from "../data/index.js";


const MAX_SELECTION = 4;

let selectedRackets = [];
let currentBrand = "All";


/* =====================================================
   ELEMENTS
===================================================== */

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

const performanceGrid =
    document.getElementById("performance-grid");

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


/* =====================================================
   DATA
===================================================== */

const performanceCharacteristics = [

    {
        key: "smashPower",
        label: "Smash Power"
    },

    {
        key: "swingSpeed",
        label: "Swing Speed"
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


const specifications = [

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


/* =====================================================
   INITIALIZE
===================================================== */

renderSelector();
renderSelected();
updateComparison();


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    renderSelector
);


/* =====================================================
   BRAND FILTER
===================================================== */

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


/* =====================================================
   SELECTOR
===================================================== */

function renderSelector() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        rackets.filter(racket => {

            const model =
                String(racket.model || "")
                    .toLowerCase();

            const brand =
                String(racket.brand || "")
                    .toLowerCase();

            const series =
                String(racket.series || "")
                    .toLowerCase();


            const matchesSearch =
                model.includes(search) ||
                brand.includes(search) ||
                series.includes(search);


            const matchesBrand =
                currentBrand === "All" ||
                racket.brand === currentBrand;


            return (
                matchesSearch &&
                matchesBrand
            );

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


        card.type = "button";

        card.className =
            "selector-list-item";


        if (isSelected) {
            card.classList.add("selected");
        }


        const specs =
            racket.officialSpecs || {};


        card.innerHTML = `

            <div class="selector-list-image">

                <img
                    src="${racket.image || ""}"
                    alt="${escapeHTML(racket.model || "Racket")}"
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

                    <span>
                        ${escapeHTML(specs.balance || "—")}
                    </span>

                    <span>
                        ${escapeHTML(specs.weight || "—")}
                    </span>

                </div>

            </div>


            <div class="selector-add">

                ${isSelected ? "✓" : "+"}

            </div>

        `;


        card.addEventListener(
            "click",
            () => toggleRacket(racket)
        );


        selector.appendChild(card);

    });

}


/* =====================================================
   TOGGLE RACKET
===================================================== */

function toggleRacket(racket) {

    const index =
        selectedRackets.findIndex(
            selected =>
                selected.id === racket.id
        );


    if (index !== -1) {

        selectedRackets.splice(
            index,
            1
        );

    } else {

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


/* =====================================================
   SELECTED RACKETS
===================================================== */

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

                <div class="selected-racket-image">

                    <img
                        src="${racket.image || ""}"
                        alt="${escapeHTML(racket.model || "Racket")}"
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
                    type="button"
                    class="remove-racket"
                    aria-label="Remove racket"
                >
                    ×
                </button>

            `;


            const removeButton =
                card.querySelector(
                    ".remove-racket"
                );


            removeButton.addEventListener(
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


/* =====================================================
   COMPARISON
===================================================== */

function updateComparison() {

    if (selectedRackets.length >= 2) {

        comparisonArea.classList.remove(
            "hidden"
        );

        emptyState.classList.add(
            "hidden"
        );


        renderPerformance();
        renderCharacteristics();
        renderSpecs();

    } else {

        comparisonArea.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   PERFORMANCE
===================================================== */

function renderPerformance() {

    performanceGrid.innerHTML = "";


    performanceCharacteristics.forEach(
        characteristic => {

            const wrapper =
                document.createElement("div");


            wrapper.className =
                "performance-row";


            const rows =
                selectedRackets.map(
                    racket => {

                        const value =
                            getNumericCharacteristic(
                                racket,
                                characteristic.key
                            );


                        return `

                            <div class="performance-racket-row">

                                <span
                                    class="performance-racket-name"
                                    title="${escapeHTML(racket.model || "")}"
                                >
                                    ${escapeHTML(
                                        shortName(racket.model)
                                    )}
                                </span>


                                <div class="performance-track">

                                    <div
                                        class="performance-fill"
                                        style="width:${value * 10}%"
                                    ></div>

                                </div>


                                <span class="performance-value">
                                    ${value}
                                </span>

                            </div>

                        `;

                    }
                )
                .join("");


            wrapper.innerHTML = `

                <div class="performance-label">

                    <span class="performance-name">
                        ${characteristic.label}
                    </span>

                </div>


                <div class="performance-rackets">

                    ${rows}

                </div>

            `;


            performanceGrid.appendChild(
                wrapper
            );

        }
    );

}


/* =====================================================
   CHARACTERISTICS TABLE
===================================================== */

function renderCharacteristics() {

    characteristicHead.innerHTML =
        "<th>Characteristic</th>";


    selectedRackets.forEach(
        racket => {

            characteristicHead.innerHTML += `

                <th>
                    ${escapeHTML(racket.model || "")}
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
                        getNumericCharacteristic(
                            racket,
                            key
                        );


                    html += `

                        <td>

                            <div class="table-value">
                                ${value}/10
                            </div>

                            <div class="table-bar">

                                <span
                                    style="width:${value * 10}%"
                                ></span>

                            </div>

                        </td>

                    `;

                }
            );


            row.innerHTML = html;

            characteristicBody.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   SPECIFICATIONS
===================================================== */

function renderSpecs() {

    specHead.innerHTML =
        "<th>Specification</th>";


    selectedRackets.forEach(
        racket => {

            specHead.innerHTML += `

                <th>
                    ${escapeHTML(racket.model || "")}
                </th>

            `;

        }
    );


    specBody.innerHTML = "";


    specifications.forEach(
        ([label, key]) => {

            const row =
                document.createElement("tr");


            let html =
                `<td>${label}</td>`;


            selectedRackets.forEach(
                racket => {

                    const specs =
                        racket.officialSpecs || {};


                    const value =
                        specs[key] ?? "—";


                    html += `

                        <td>
                            ${escapeHTML(
                                String(value)
                            )}
                        </td>

                    `;

                }
            );


            row.innerHTML = html;

            specBody.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   HELPERS
===================================================== */

function getNumericCharacteristic(
    racket,
    key
) {

    const value =
        racket?.characteristics?.[key];


    const number =
        Number(value);


    if (
        Number.isFinite(number)
    ) {

        return Math.max(
            0,
            Math.min(10, number)
        );

    }


    return 0;

}


function shortName(name) {

    if (!name) {
        return "Racket";
    }


    if (name.length <= 16) {
        return name;
    }


    return (
        name
            .replace("Thruster ", "")
            .replace("Astrox ", "")
            .slice(0, 16)
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
