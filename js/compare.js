import { rackets } from "../data/index.js";


const MAX_SELECTION = 4;

let selectedRackets = [];

let currentBrand = "All";


/* =====================================================
   RADAR AXES
===================================================== */

const radarAxes = [

    {
        key: "smashPower",
        label: "Smash Power"
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


/* =====================================================
   SPEC ROWS
===================================================== */

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
   ELEMENTS
===================================================== */

const searchInput =
    document.getElementById("compare-search");

const selector =
    document.getElementById("racket-selector");

const selectedContainer =
    document.getElementById("selected-rackets");

const selectionCount =
    document.getElementById("selection-count");

const comparisonArea =
    document.getElementById("comparison-area");

const specSection =
    document.getElementById("spec-section");

const emptyState =
    document.getElementById("compare-empty");

const radarCanvas =
    document.getElementById("radar-chart");

const radarLegend =
    document.getElementById("radar-legend");

const specHead =
    document.getElementById("spec-head");

const specBody =
    document.getElementById("spec-body");

const filterButtons =
    document.querySelectorAll(".compare-filter");


/* =====================================================
   COLORS
===================================================== */

const racketColors = [

    "#111827",
    "#2563eb",
    "#dc2626",
    "#16a34a"

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
   FILTER
===================================================== */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentBrand =
                button.dataset.brand;

            filterButtons.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );

            button.classList.add(
                "active"
            );

            renderSelector();

        }
    );

});


/* =====================================================
   SELECTOR
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

            <div style="
                grid-column:1/-1;
                padding:30px;
                text-align:center;
                color:#6b7280;
            ">
                No rackets found.
            </div>

        `;

        return;
    }


    filtered.forEach(
        racket => {

            const selected =
                selectedRackets.some(
                    item =>
                        item.id === racket.id
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "selector-list-item";


            if (selected) {

                button.classList.add(
                    "selected"
                );

            }


            const specs =
                racket.officialSpecs || {};


            button.innerHTML = `

                <div class="selector-list-image">

                    <img
                        src="${racket.image || ""}"
                        alt="${escapeHTML(
                            racket.model
                        )}"
                    >

                </div>


                <div class="selector-list-info">

                    <span class="selector-brand">
                        ${escapeHTML(
                            racket.brand || ""
                        )}
                    </span>

                    <strong>
                        ${escapeHTML(
                            racket.model || ""
                        )}
                    </strong>

                    <div class="selector-meta">

                        <span>
                            ${escapeHTML(
                                specs.weight || "—"
                            )}
                        </span>

                        <span>
                            ${escapeHTML(
                                specs.balance || "—"
                            )}
                        </span>

                    </div>

                </div>


                <div class="selector-add">

                    ${selected ? "✓" : "+"}

                </div>

            `;


            button.addEventListener(
                "click",
                () =>
                    toggleRacket(racket)
            );


            selector.appendChild(button);

        }
    );

}


/* =====================================================
   TOGGLE
===================================================== */

function toggleRacket(racket) {

    const index =
        selectedRackets.findIndex(
            item =>
                item.id === racket.id
        );


    if (index >= 0) {

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


        selectedRackets.push(
            racket
        );

    }


    renderSelector();

    renderSelected();

    updateComparison();

}


/* =====================================================
   SELECTED CARDS
===================================================== */

function renderSelected() {

    selectedContainer.innerHTML = "";


    selectedRackets.forEach(
        (racket, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "selected-racket-card";


            card.innerHTML = `

                <div class="selected-racket-image">

                    <img
                        src="${racket.image || ""}"
                        alt="${escapeHTML(
                            racket.model
                        )}"
                    >

                </div>


                <div class="selected-racket-info">

                    <span>
                        ${escapeHTML(
                            racket.brand || ""
                        )}
                    </span>

                    <h3>
                        ${escapeHTML(
                            racket.model || ""
                        )}
                    </h3>

                </div>


                <button
                    type="button"
                    class="remove-racket"
                >
                    ×
                </button>

            `;


            card
                .querySelector(
                    ".remove-racket"
                )
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


            selectedContainer.appendChild(
                card
            );

        }
    );


    selectionCount.textContent =
        `${selectedRackets.length} / ${MAX_SELECTION} selected`;


    if (!selectedRackets.length) {

        selectedContainer.innerHTML = `

            <div style="
                grid-column:1/-1;
                padding:25px;
                text-align:center;
                color:#9ca3af;
            ">
                No rackets selected.
            </div>

        `;

    }

}


/* =====================================================
   UPDATE
===================================================== */

function updateComparison() {

    const enough =
        selectedRackets.length >= 2;


    if (enough) {

        comparisonArea.classList.remove(
            "hidden"
        );

        specSection.classList.remove(
            "hidden"
        );

        emptyState.classList.add(
            "hidden"
        );


        drawRadar();

        renderLegend();

        renderSpecs();

    } else {

        comparisonArea.classList.add(
            "hidden"
        );

        specSection.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   RADAR DRAWING
===================================================== */

function drawRadar() {

    const canvas =
        radarCanvas;

    const ctx =
        canvas.getContext("2d");


    const rect =
        canvas.getBoundingClientRect();


    const size =
        Math.min(
            rect.width || 560,
            560
        );


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        size * dpr;

    canvas.height =
        size * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const width =
        size;

    const height =
        size;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const centerX =
        width / 2;

    const centerY =
        height / 2;


    const radius =
        Math.min(
            width,
            height
        ) * 0.33;


    const count =
        radarAxes.length;


    /*
       Top axis starts at -90 degrees.
    */

    const angleStep =
        (Math.PI * 2) / count;


    function point(
        index,
        value,
        extraRadius = 0
    ) {

        const angle =
            -Math.PI / 2 +
            index * angleStep;


        const r =
            extraRadius ||
            radius * (
                value / 10
            );


        return {

            x:
                centerX +
                Math.cos(angle) * r,

            y:
                centerY +
                Math.sin(angle) * r

        };

    }


    /* GRID */

    for (
        let level = 1;
        level <= 5;
        level++
    ) {

        const value =
            level * 2;


        ctx.beginPath();


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const p =
                point(
                    i,
                    value
                );


            if (i === 0) {

                ctx.moveTo(
                    p.x,
                    p.y
                );

            } else {

                ctx.lineTo(
                    p.x,
                    p.y
                );

            }

        }


        ctx.closePath();


        ctx.strokeStyle =
            "#e5e7eb";

        ctx.lineWidth =
            1;

        ctx.stroke();

    }


    /* AXIS LINES */

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const p =
            point(
                i,
                10
            );


        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.lineTo(
            p.x,
            p.y
        );


        ctx.strokeStyle =
            "#e5e7eb";

        ctx.lineWidth =
            1;

        ctx.stroke();

    }


    /* LABELS */

    ctx.font =
        "600 12px Arial";

    ctx.fillStyle =
        "#4b5563";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    radarAxes.forEach(
        (axis, index) => {

            const angle =
                -Math.PI / 2 +
                index * angleStep;


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


            ctx.fillText(
                axis.label,
                x,
                y
            );

        }
    );


    /* DATA */

    selectedRackets.forEach(
        (racket, racketIndex) => {

            const color =
                racketColors[
                    racketIndex %
                    racketColors.length
                ];


            ctx.beginPath();


            radarAxes.forEach(
                (axis, index) => {

                    const value =
                        getValue(
                            racket,
                            axis.key
                        );


                    const p =
                        point(
                            index,
                            value
                        );


                    if (index === 0) {

                        ctx.moveTo(
                            p.x,
                            p.y
                        );

                    } else {

                        ctx.lineTo(
                            p.x,
                            p.y
                        );

                    }

                }
            );


            ctx.closePath();


            ctx.fillStyle =
                hexToRGBA(
                    color,
                    0.10
                );

            ctx.fill();


            ctx.strokeStyle =
                color;

            ctx.lineWidth =
                2.5;

            ctx.stroke();


            /* POINTS */

            radarAxes.forEach(
                (axis, index) => {

                    const value =
                        getValue(
                            racket,
                            axis.key
                        );


                    const p =
                        point(
                            index,
                            value
                        );


                    ctx.beginPath();

                    ctx.arc(
                        p.x,
                        p.y,
                        4,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        color;

                    ctx.fill();

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
                "legend-item";


            item.style.setProperty(
                "--legend-color",
                color
            );


            item.innerHTML = `

                <span
                    class="legend-dot"
                ></span>


                <div class="legend-image">

                    <img
                        src="${racket.image || ""}"
                        alt=""
                    >

                </div>


                <span class="legend-name">

                    ${escapeHTML(
                        racket.model || ""
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
   SPECS TABLE
===================================================== */

function renderSpecs() {

    specHead.innerHTML =
        "<th>Specification</th>";


    selectedRackets.forEach(
        racket => {

            specHead.innerHTML += `

                <th>
                    ${escapeHTML(
                        racket.model || ""
                    )}
                </th>

            `;

        }
    );


    specBody.innerHTML = "";


    specifications.forEach(
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
                        specs[key] ??
                        "—";


                    html += `

                        <td>
                            ${escapeHTML(
                                String(value)
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
   VALUE
===================================================== */

function getValue(
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
            Math.min(
                10,
                number
            )
        );

    }


    return 0;

}


/* =====================================================
   COLOR
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


    const bigint =
        parseInt(
            clean,
            16
        );


    const r =
        (bigint >> 16) & 255;

    const g =
        (bigint >> 8) & 255;

    const b =
        bigint & 255;


    return `rgba(${r}, ${g}, ${b}, ${alpha})`;

}


/* =====================================================
   ESCAPE
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
   RESIZE
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            selectedRackets.length >= 2
        ) {

            drawRadar();

        }

    }
);
