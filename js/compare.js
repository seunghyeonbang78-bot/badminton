import { rackets } from "../data/index.js";


/* =====================================================
   SETTINGS
===================================================== */

const MAX_SELECTION = 4;


/*
    Exactly 7 axes.

    The values come from:
    racket.characteristics
*/

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
        key: "repulsion",
        label: "Repulsion"
    },

    {
        key: "stability",
        label: "Stability"
    },

    {
        key: "headHeavy",
        label: "Head Heavy"
    }

];


/*
    Detailed characteristics table
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
    Official specifications table
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
    One color per selected racket.
*/

const racketColors = [

    "#111827",
    "#2563eb",
    "#dc2626",
    "#16a34a"

];


/* =====================================================
   STATE
===================================================== */

let selectedRackets = [];

let currentBrand = "All";


/* =====================================================
   ELEMENTS
===================================================== */

const searchInput =
    document.getElementById(
        "compare-search"
    );


const selector =
    document.getElementById(
        "racket-selector"
    );


const selectedContainer =
    document.getElementById(
        "selected-rackets"
    );


const selectionCount =
    document.getElementById(
        "selection-count"
    );


const comparisonArea =
    document.getElementById(
        "comparison-area"
    );


const emptyState =
    document.getElementById(
        "compare-empty"
    );


const radarCanvas =
    document.getElementById(
        "radar-chart"
    );


const radarLegend =
    document.getElementById(
        "radar-legend"
    );


const characteristicHead =
    document.getElementById(
        "characteristic-head"
    );


const characteristicBody =
    document.getElementById(
        "characteristic-body"
    );


const specHead =
    document.getElementById(
        "spec-head"
    );


const specBody =
    document.getElementById(
        "spec-body"
    );


const filterButtons =
    document.querySelectorAll(
        ".compare-filter"
    );


/* =====================================================
   START
===================================================== */

renderSelector();

renderSelected();

updateComparison();


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        renderSelector();

    }
);


/* =====================================================
   BRAND FILTER
===================================================== */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                currentBrand =
                    button.dataset.brand;


                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderSelector();

            }
        );

    }
);


/* =====================================================
   RENDER RACKET SELECTOR
===================================================== */

function renderSelector() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        rackets.filter(
            racket => {

                const model =
                    String(
                        racket.model || ""
                    ).toLowerCase();


                const brand =
                    String(
                        racket.brand || ""
                    ).toLowerCase();


                const series =
                    String(
                        racket.series || ""
                    ).toLowerCase();


                const matchesSearch =
                    model.includes(query) ||
                    brand.includes(query) ||
                    series.includes(query);


                const matchesBrand =
                    currentBrand === "All" ||
                    racket.brand === currentBrand;


                return (
                    matchesSearch &&
                    matchesBrand
                );

            }
        );


    selector.innerHTML = "";


    if (!filtered.length) {

        selector.innerHTML = `

            <div class="no-results">

                <strong>
                    No rackets found
                </strong>

                <p>
                    Try another search or brand.
                </p>

            </div>

        `;

        return;
    }


    filtered.forEach(
        racket => {

            const isSelected =
                selectedRackets.some(
                    selected =>
                        selected.id === racket.id
                );


            const card =
                document.createElement(
                    "button"
                );


            card.type = "button";


            card.className =
                "selector-list-item";


            if (isSelected) {

                card.classList.add(
                    "selected"
                );

            }


            const specs =
                racket.officialSpecs || {};


            card.innerHTML = `

                <div class="selector-list-image">

                    <img
                        src="${safeAttribute(
                            racket.image
                        )}"
                        alt="${escapeHTML(
                            racket.model
                        )}"
                    >

                </div>


                <div class="selector-list-info">

                    <span class="selector-brand">

                        ${escapeHTML(
                            racket.brand
                        )}

                    </span>


                    <strong>

                        ${escapeHTML(
                            racket.model
                        )}

                    </strong>


                    <div class="selector-meta">

                        <span>

                            ${escapeHTML(
                                specs.balance || "—"
                            )}

                        </span>


                        <span>

                            ${escapeHTML(
                                specs.weight || "—"
                            )}

                        </span>

                    </div>

                </div>


                <div class="selector-add">

                    ${isSelected ? "✓" : "+"}

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    toggleRacket(
                        racket
                    );

                }
            );


            selector.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   SELECT / REMOVE RACKET
===================================================== */

function toggleRacket(
    racket
) {

    const index =
        selectedRackets.findIndex(
            selected =>
                selected.id === racket.id
        );


    /*
        Already selected
        -> remove
    */

    if (index !== -1) {

        selectedRackets.splice(
            index,
            1
        );

    }


    /*
        Not selected
        -> add
    */

    else {

        if (
            selectedRackets.length >=
            MAX_SELECTION
        ) {

            return;

        }


        selectedRackets.push(
            racket
        );

    }


    renderSelector();

    renderSelected();

    updateComparison();

}


/* =====================================================
   SELECTED RACKET CARDS
===================================================== */

function renderSelected() {

    selectedContainer.innerHTML = "";


    if (
        selectedRackets.length === 0
    ) {

        selectedContainer.innerHTML = `

            <div class="selected-placeholder">

                No rackets selected yet.

            </div>

        `;

    }


    selectedRackets.forEach(
        (racket, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "selected-racket-card";


            const color =
                racketColors[
                    index %
                    racketColors.length
                ];


            card.innerHTML = `

                <div
                    class="selected-racket-color"
                    style="background:${color}"
                ></div>


                <div class="selected-racket-image">

                    <img
                        src="${safeAttribute(
                            racket.image
                        )}"
                        alt="${escapeHTML(
                            racket.model
                        )}"
                    >

                </div>


                <div class="selected-racket-info">

                    <span>

                        ${escapeHTML(
                            racket.brand
                        )}

                    </span>


                    <h3>

                        ${escapeHTML(
                            racket.model
                        )}

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


            selectedContainer.appendChild(
                card
            );

        }
    );


    selectionCount.textContent =
        `${selectedRackets.length} / ${MAX_SELECTION} selected`;

}


/* =====================================================
   UPDATE COMPARISON
===================================================== */

function updateComparison() {

    const enoughRackets =
        selectedRackets.length >= 2;


    if (enoughRackets) {

        comparisonArea.classList.remove(
            "hidden"
        );


        emptyState.classList.add(
            "hidden"
        );


        renderRadar();

        renderLegend();

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


/* =====================================================
   RADAR CHART
===================================================== */

function renderRadar() {

    const canvas =
        radarCanvas;


    const context =
        canvas.getContext(
            "2d"
        );


    /*
        Get the actual CSS width.

        This is important because the canvas
        must scale correctly on different screens.
    */

    const cssWidth =
        Math.min(
            canvas.parentElement.clientWidth,
            580
        );


    const size =
        Math.max(
            300,
            cssWidth
        );


    const devicePixelRatio =
        window.devicePixelRatio || 1;


    canvas.width =
        size *
        devicePixelRatio;


    canvas.height =
        size *
        devicePixelRatio;


    canvas.style.width =
        `${size}px`;


    canvas.style.height =
        `${size}px`;


    context.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );


    context.clearRect(
        0,
        0,
        size,
        size
    );


    const centerX =
        size / 2;


    const centerY =
        size / 2;


    /*
        Leave room for labels.
    */

    const radius =
        size * 0.31;


    const axisCount =
        radarAxes.length;


    const angleStep =
        (Math.PI * 2) /
        axisCount;


    /*
        Convert radar value into a point.
    */

    function getPoint(
        axisIndex,
        value,
        customRadius = null
    ) {

        const angle =
            -Math.PI / 2 +
            axisIndex *
            angleStep;


        const actualRadius =
            customRadius !== null
                ? customRadius
                : radius *
                    (
                        value / 10
                    );


        return {

            x:
                centerX +
                Math.cos(angle) *
                actualRadius,

            y:
                centerY +
                Math.sin(angle) *
                actualRadius

        };

    }


    /* =================================================
       GRID
    ================================================= */

    for (
        let level = 1;
        level <= 5;
        level++
    ) {

        const value =
            level * 2;


        context.beginPath();


        radarAxes.forEach(
            (_, index) => {

                const point =
                    getPoint(
                        index,
                        value
                    );


                if (index === 0) {

                    context.moveTo(
                        point.x,
                        point.y
                    );

                }

                else {

                    context.lineTo(
                        point.x,
                        point.y
                    );

                }

            }
        );


        context.closePath();


        context.strokeStyle =
            "#e5e7eb";


        context.lineWidth = 1;


        context.stroke();

    }


    /* =================================================
       AXES
    ================================================= */

    radarAxes.forEach(
        (_, index) => {

            const point =
                getPoint(
                    index,
                    10
                );


            context.beginPath();


            context.moveTo(
                centerX,
                centerY
            );


            context.lineTo(
                point.x,
                point.y
            );


            context.strokeStyle =
                "#e5e7eb";


            context.lineWidth = 1;


            context.stroke();

        }
    );


    /* =================================================
       LABELS
    ================================================= */

    context.font =
        "600 12px Arial";


    context.fillStyle =
        "#4b5563";


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    radarAxes.forEach(
        (axis, index) => {

            const angle =
                -Math.PI / 2 +
                index *
                angleStep;


            const labelRadius =
                radius + 38;


            const x =
                centerX +
                Math.cos(angle) *
                labelRadius;


            const y =
                centerY +
                Math.sin(angle) *
                labelRadius;


            context.fillText(
                axis.label,
                x,
                y
            );

        }
    );


    /* =================================================
       SCALE NUMBERS
    ================================================= */

    context.font =
        "10px Arial";


    context.fillStyle =
        "#9ca3af";


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    [2, 4, 6, 8, 10].forEach(
        value => {

            const point =
                getPoint(
                    0,
                    value
                );


            context.fillText(
                String(value),
                point.x + 13,
                point.y
            );

        }
    );


    /* =================================================
       RACKET DATA
    ================================================= */

    selectedRackets.forEach(
        (racket, racketIndex) => {

            const color =
                racketColors[
                    racketIndex %
                    racketColors.length
                ];


            context.beginPath();


            radarAxes.forEach(
                (axis, index) => {

                    const value =
                        getCharacteristicValue(
                            racket,
                            axis.key
                        );


                    const point =
                        getPoint(
                            index,
                            value
                        );


                    if (index === 0) {

                        context.moveTo(
                            point.x,
                            point.y
                        );

                    }

                    else {

                        context.lineTo(
                            point.x,
                            point.y
                        );

                    }

                }
            );


            context.closePath();


            /*
                Transparent fill.
            */

            context.fillStyle =
                hexToRGBA(
                    color,
                    0.10
                );


            context.fill();


            /*
                Main outline.
            */

            context.strokeStyle =
                color;


            context.lineWidth =
                2.5;


            context.stroke();


            /*
                Data points.
            */

            radarAxes.forEach(
                (axis, index) => {

                    const value =
                        getCharacteristicValue(
                            racket,
                            axis.key
                        );


                    const point =
                        getPoint(
                            index,
                            value
                        );


                    context.beginPath();


                    context.arc(
                        point.x,
                        point.y,
                        4,
                        0,
                        Math.PI * 2
                    );


                    context.fillStyle =
                        color;


                    context.fill();

                }
            );

        }
    );

}


/* =====================================================
   LEGEND
===================================================== */

function renderLegend() {

    radarLegend.innerHTML = "";


    selectedRackets.forEach(
        (racket, index) => {

            const color =
                racketColors[
                    index %
                    racketColors.length
                ];


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "radar-legend-item";


            item.innerHTML = `

                <span
                    class="legend-dot"
                    style="background:${color}"
                ></span>


                <div class="legend-image">

                    <img
                        src="${safeAttribute(
                            racket.image
                        )}"
                        alt=""
                    >

                </div>


                <span class="legend-name">

                    ${escapeHTML(
                        racket.model
                    )}

                </span>

            `;


            radarLegend.appendChild(
                item
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

                    ${escapeHTML(
                        racket.model
                    )}

                </th>

            `;

        }
    );


    characteristicBody.innerHTML = "";


    characteristicRows.forEach(
        ([label, key]) => {

            const row =
                document.createElement(
                    "tr"
                );


            let html =
                `<td>${label}</td>`;


            selectedRackets.forEach(
                racket => {

                    const value =
                        getCharacteristicValue(
                            racket,
                            key
                        );


                    html += `

                        <td>

                            <div
                                class="characteristic-value"
                            >
                                ${value}/10
                            </div>


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


            row.innerHTML =
                html;


            characteristicBody.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   OFFICIAL SPECIFICATIONS
===================================================== */

function renderSpecs() {

    specHead.innerHTML =
        "<th>Specification</th>";


    selectedRackets.forEach(
        racket => {

            specHead.innerHTML += `

                <th>

                    ${escapeHTML(
                        racket.model
                    )}

                </th>

            `;

        }
    );


    specBody.innerHTML = "";


    specificationRows.forEach(
        ([label, key]) => {

            const row =
                document.createElement(
                    "tr"
                );


            let html =
                `<td>${label}</td>`;


            selectedRackets.forEach(
                racket => {

                    const specs =
                        racket.officialSpecs ||
                        {};


                    const value =
                        specs[key];


                    html += `

                        <td>

                            ${escapeHTML(
                                value ??
                                "—"
                            )}

                        </td>

                    `;

                }
            );


            row.innerHTML =
                html;


            specBody.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   GET CHARACTERISTIC VALUE
===================================================== */

function getCharacteristicValue(
    racket,
    key
) {

    const characteristics =
        racket.characteristics ||
        {};


    const number =
        Number(
            characteristics[key]
        );


    if (
        !Number.isFinite(number)
    ) {

        return 0;

    }


    return Math.max(
        0,
        Math.min(
            10,
            number
        )
    );

}


/* =====================================================
   HEX -> RGBA
===================================================== */

function hexToRGBA(
    hex,
    alpha
) {

    const clean =
        hex.replace(
            "#",
            ""
        );


    const number =
        parseInt(
            clean,
            16
        );


    const red =
        (number >> 16) & 255;


    const green =
        (number >> 8) & 255;


    const blue =
        number & 255;


    return `
        rgba(
            ${red},
            ${green},
            ${blue},
            ${alpha}
        )
    `;

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   SAFE IMAGE ATTRIBUTE
===================================================== */

function safeAttribute(
    value
) {

    return escapeHTML(
        value || ""
    );

}


/* =====================================================
   RESIZE
===================================================== */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    if (
                        selectedRackets.length >= 2
                    ) {

                        renderRadar();

                    }

                },
                100
            );

    }
);
