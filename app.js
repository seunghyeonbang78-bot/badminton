/* =================================
   STATE
================================= */

let selectedRackets = [];


/* =================================
   INITIALIZE
================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderFeatured();

        renderRackets();

        renderComparison();

    }
);


/* =================================
   FEATURED
================================= */

function renderFeatured() {

    const container =
        document.getElementById(
            "featured-rackets"
        );

    const featured =
        rackets.slice(0, 3);

    container.innerHTML =
        featured
            .map(
                racket =>
                    createRacketCard(
                        racket
                    )
            )
            .join("");

}


/* =================================
   CREATE CARD
================================= */

function createRacketCard(
    racket
) {

    const c =
        racket.characteristics;

    return `

        <article
            class="racket-card"
            onclick="openRacket('${racket.id}')"
        >

            <div class="racket-image">

                ${racket.brand.toUpperCase()}

                <br>

                RACKET IMAGE

            </div>


            <div class="brand">
                ${racket.brand}
            </div>


            <h3 class="racket-name">
                ${racket.model}
            </h3>


            <div class="racket-meta">

                <span class="tag">
                    ${racket.balance}
                </span>

                <span class="tag">
                    ${racket.shaft}
                </span>

                <span class="tag">
                    ${racket.weight}
                </span>

            </div>


            ${ratingRow(
                "Smash",
                c.smashPower
            )}

            ${ratingRow(
                "Control",
                c.control
            )}

            ${ratingRow(
                "Defense",
                c.defense
            )}

        </article>

    `;
}


/* =================================
   RATING ROW
================================= */

function ratingRow(
    name,
    value
) {

    return `

        <div class="rating-row">

            <span>
                ${name}
            </span>

            <div class="rating-track">

                <div
                    class="rating-fill"
                    style="width:${value * 10}%"
                ></div>

            </div>

            <strong>
                ${value}
            </strong>

        </div>

    `;
}


/* =================================
   RENDER RACKETS
================================= */

function renderRackets() {

    const search =
        document
            .getElementById(
                "search-input"
            )
            .value
            .toLowerCase();


    const brand =
        document
            .getElementById(
                "brand-filter"
            )
            .value;


    const balance =
        document
            .getElementById(
                "balance-filter"
            )
            .value;


    const style =
        document
            .getElementById(
                "style-filter"
            )
            .value;


    const sort =
        document
            .getElementById(
                "sort-filter"
            )
            .value;


    let results =
        rackets.filter(
            racket => {

                const searchable = [

                    racket.brand,

                    racket.model,

                    racket.series,

                    racket.balance,

                    racket.shaft,

                    ...racket.category,

                    ...racket.playingStyle

                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchable.includes(
                        search
                    );


                const matchesBrand =
                    brand === "all" ||
                    racket.brand === brand;


                const matchesBalance =
                    balance === "all" ||
                    racket.balance === balance;


                const matchesStyle =
                    style === "all" ||
                    racket.category.includes(
                        style
                    );


                return (
                    matchesSearch &&
                    matchesBrand &&
                    matchesBalance &&
                    matchesStyle
                );

            }
        );


    /* SORT */

    const c = r =>
        r.characteristics;


    if (sort === "smash") {

        results.sort(
            (a, b) =>
                c(b).smashPower -
                c(a).smashPower
        );

    }

    if (sort === "control") {

        results.sort(
            (a, b) =>
                c(b).control -
                c(a).control
        );

    }

    if (sort === "defense") {

        results.sort(
            (a, b) =>
                c(b).defense -
                c(a).defense
        );

    }

    if (sort === "stability") {

        results.sort(
            (a, b) =>
                c(b).stability -
                c(a).stability
        );

    }

    if (sort === "speed") {

        results.sort(
            (a, b) =>
                c(b).swingSpeed -
                c(a).swingSpeed
        );

    }


    document
        .getElementById(
            "result-count"
        )
        .textContent =
        `${results.length} rackets`;


    document
        .getElementById(
            "racket-list"
        )
        .innerHTML =
        results
            .map(
                createRacketCard
            )
            .join("");

}


/* =================================
   CLEAR FILTERS
================================= */

function clearFilters() {

    document
        .getElementById(
            "search-input"
        )
        .value = "";


    document
        .getElementById(
            "brand-filter"
        )
        .value = "all";


    document
        .getElementById(
            "balance-filter"
        )
        .value = "all";


    document
        .getElementById(
            "style-filter"
        )
        .value = "all";


    document
        .getElementById(
            "sort-filter"
        )
        .value = "default";


    renderRackets();

}


/* =================================
   OPEN RACKET
================================= */

function openRacket(id) {

    const racket =
        rackets.find(
            r => r.id === id
        );


    if (!racket) return;


    const c =
        racket.characteristics;


    const modal =
        document.getElementById(
            "racket-modal"
        );


    const body =
        document.getElementById(
            "modal-body"
        );


    body.innerHTML = `

        <div class="detail-header">

            <div class="detail-brand">
                ${racket.brand}
            </div>

            <h1 class="detail-title">
                ${racket.model}
            </h1>

            <p class="detail-description">
                ${racket.description}
            </p>

        </div>


        <div class="racket-meta">

            ${racket.category
                .map(
                    category =>
                        `<span class="tag">
                            ${category}
                        </span>`
                )
                .join("")}

        </div>


        <section class="detail-section">

            <h3>
                Performance Profile
            </h3>


            ${largeRating(
                "Head Heavy",
                c.headHeavy
            )}

            ${largeRating(
                "Smash Power",
                c.smashPower
            )}

            ${largeRating(
                "Power",
                c.power
            )}

            ${largeRating(
                "Repulsion",
                c.repulsion
            )}

            ${largeRating(
                "Control",
                c.control
            )}

            ${largeRating(
                "Defense",
                c.defense
            )}

            ${largeRating(
                "Swing Speed",
                c.swingSpeed
            )}

            ${largeRating(
                "Stability",
                c.stability
            )}

            ${largeRating(
                "Maneuverability",
                c.maneuverability
            )}

            ${largeRating(
                "Holding",
                c.holding
            )}

            ${largeRating(
                "Touch",
                c.touch
            )}

            ${largeRating(
                "Precision",
                c.precision
            )}

        </section>


        <section class="detail-section">

            <h3>
                Specifications
            </h3>

            ${specTable(
                racket.specs
            )}

        </section>


        <section class="detail-section">

            <h3>
                Strengths
            </h3>

            <ul>

                ${racket.strengths
                    .map(
                        x =>
                            `<li>${x}</li>`
                    )
                    .join("")}

            </ul>

        </section>


        <section class="detail-section">

            <h3>
                Suitable For
            </h3>

            <ul>

                ${racket.suitableFor
                    .map(
                        x =>
                            `<li>${x}</li>`
                    )
                    .join("")}

            </ul>

        </section>


        <section class="detail-section">

            <button
                class="button primary"
                onclick="addToCompare('${racket.id}')"
            >
                Add to Compare
            </button>

        </section>

    `;


    modal.classList.remove(
        "hidden"
    );

}


function largeRating(
    name,
    value
) {

    return `

        <div class="rating-large">

            <span>
                ${name}
            </span>

            <div class="rating-track">

                <div
                    class="rating-fill"
                    style="width:${value * 10}%"
                ></div>

            </div>

            <strong>
                ${value}
            </strong>

        </div>

    `;
}


/* =================================
   SPEC TABLE
================================= */

function specTable(
    specs
) {

    return `

        <table>

            <tbody>

                ${Object.entries(
                    specs
                )
                .map(
                    ([key, value]) => `

                    <tr>

                        <th>
                            ${formatKey(key)}
                        </th>

                        <td>
                            ${value}
                        </td>

                    </tr>

                `
                )
                .join("")}

            </tbody>

        </table>

    `;
}


function formatKey(
    key
) {

    return key
        .replace(
            /([A-Z])/g,
            " $1"
        )
        .replace(
            /^./,
            x => x.toUpperCase()
        );

}


/* =================================
   MODAL
================================= */

function closeModal() {

    document
        .getElementById(
            "racket-modal"
        )
        .classList.add(
            "hidden"
        );

}


/* =================================
   COMPARE
================================= */

function addToCompare(id) {

    if (
        selectedRackets.includes(id)
    ) {

        return;

    }


    if (
        selectedRackets.length >= 4
    ) {

        alert(
            "You can compare up to 4 rackets."
        );

        return;

    }


    selectedRackets.push(id);


    renderComparison();

    scrollToCompare();

}


function removeFromCompare(id) {

    selectedRackets =
        selectedRackets.filter(
            x => x !== id
        );


    renderComparison();

}


/* =================================
   COMPARISON
================================= */

function renderComparison() {

    const selection =
        document.getElementById(
            "compare-selection"
        );


    selection.innerHTML =
        [0, 1, 2, 3]
            .map(
                index => {

                    const id =
                        selectedRackets[
                            index
                        ];


                    if (!id) {

                        return `

                            <div class="compare-slot">

                                <strong>
                                    Empty slot
                                </strong>

                                <p>
                                    Add a racket
                                    from Explorer.
                                </p>

                            </div>

                        `;

                    }


                    const racket =
                        rackets.find(
                            r => r.id === id
                        );


                    return `

                        <div class="compare-slot active">

                            <button
                                onclick="removeFromCompare('${id}')"
                            >
                                ×
                            </button>

                            <strong>
                                ${racket.model}
                            </strong>

                            <p>
                                ${racket.brand}
                            </p>

                        </div>

                    `;

                }
            )
            .join("");


    renderComparisonTable();

}


function renderComparisonTable() {

    const container =
        document.getElementById(
            "comparison-table"
        );


    if (
        selectedRackets.length === 0
    ) {

        container.innerHTML = `

            <div class="compare-slot">

                Select rackets to begin comparing.

            </div>

        `;

        return;

    }


    const selected =
        selectedRackets.map(
            id =>
                rackets.find(
                    r => r.id === id
                )
        );


    const features = [

        ["Balance", "balance"],

        ["Shaft", "shaft"],

        ["Smash Power", "smashPower"],

        ["Power", "power"],

        ["Repulsion", "repulsion"],

        ["Control", "control"],

        ["Defense", "defense"],

        ["Swing Speed", "swingSpeed"],

        ["Stability", "stability"],

        ["Maneuverability", "maneuverability"],

        ["Holding", "holding"],

        ["Touch", "touch"],

        ["Precision", "precision"]

    ];


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Feature
                    </th>

                    ${selected
                        .map(
                            r =>
                                `<th>
                                    ${r.model}
                                </th>`
                        )
                        .join("")}

                </tr>

            </thead>


            <tbody>

                ${features
                    .map(
                        ([label, key]) => `

                        <tr>

                            <td>
                                <strong>
                                    ${label}
                                </strong>
                            </td>

                            ${selected
                                .map(
                                    r => {

                                        let value =
                                            r[key];


                                        if (
                                            r.characteristics
                                        ) {

                                            value =
                                                r.characteristics[
                                                    key
                                                ] ??
                                                value;

                                        }


                                        return `
                                            <td>
                                                ${
                                                    value ??
                                                    "-"
                                                }
                                            </td>
                                        `;

                                    }
                                )
                                .join("")}

                        </tr>

                    `
                    )
                    .join("")}

            </tbody>

        </table>

    `;

}


/* =================================
   NAVIGATION
================================= */

function scrollToExplorer() {

    document
        .getElementById(
            "explore"
        )
        .scrollIntoView();

}


function scrollToCompare() {

    document
        .getElementById(
            "compare"
        )
        .scrollIntoView();

}


/* =================================
   MOBILE
================================= */

function toggleMobileMenu() {

    const nav =
        document.querySelector(
            ".nav-links"
        );


    if (
        nav.style.display === "flex"
    ) {

        nav.style.display = "";

    } else {

        nav.style.display = "flex";

        nav.style.position =
            "absolute";

        nav.style.top = "72px";

        nav.style.left = "0";

        nav.style.right = "0";

        nav.style.padding = "20px";

        nav.style.background =
            "#f6f6f3";

        nav.style.flexDirection =
            "column";

    }

}
