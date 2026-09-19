import { rackets } from "../data/index.js";


const container =
    document.getElementById("racket-detail");


const params =
    new URLSearchParams(
        window.location.search
    );


const id =
    params.get("id");


const racket =
    rackets.find(
        item => item.id === id
    );


if (!racket) {

    container.innerHTML = `

        <div class="not-found">

            <h1>
                Racket not found
            </h1>

            <a href="rackets.html">
                ← Back to Rackets
            </a>

        </div>

    `;

} else {

    renderRacket();

}


function renderRacket() {

    container.innerHTML = `

        <div class="racket-hero">

            <a
                href="rackets.html"
                class="back-link"
            >
                ← All Rackets
            </a>


            <div class="detail-hero-grid">

                <div class="detail-image">

                    <img
                        src="${racket.image}"
                        alt="${racket.model}"
                    >

                </div>


                <div class="detail-heading">

                    <p class="eyebrow">
                        ${racket.brand}
                    </p>

                    <h1>
                        ${racket.model}
                    </h1>

                    <p class="detail-category">

                        ${racket.category.join(" · ")}

                    </p>


                    <div class="quick-specs">

                        <div>
                            <span>Balance</span>
                            <strong>
                                ${racket.officialSpecs.balance}
                            </strong>
                        </div>

                        <div>
                            <span>Weight</span>
                            <strong>
                                ${racket.officialSpecs.weight}
                            </strong>
                        </div>

                        <div>
                            <span>Shaft</span>
                            <strong>
                                ${racket.officialSpecs.shaftStiffness}
                            </strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>


        <div class="detail-tabs">

            <button
                class="detail-tab active"
                data-tab="table"
            >
                Table
            </button>

            <button
                class="detail-tab"
                data-tab="specs"
            >
                Specs
            </button>

            <button
                class="detail-tab"
                data-tab="description"
            >
                My Description
            </button>

        </div>


        <div
            id="detail-content"
            class="detail-content"
        ></div>

    `;


    const tabs =
        document.querySelectorAll(
            ".detail-tab"
        );


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(
                    t =>
                        t.classList.remove(
                            "active"
                        )
                );


                tab.classList.add("active");


                showTab(
                    tab.dataset.tab
                );

            }
        );

    });


    showTab("table");

}


function showTab(tab) {

    const content =
        document.getElementById(
            "detail-content"
        );


    if (tab === "table") {

        content.innerHTML = `

            <div class="characteristic-grid">

                ${createRating(
                    "Head Heavy",
                    racket.characteristics.headHeavy
                )}

                ${createRating(
                    "Smash Power",
                    racket.characteristics.smashPower
                )}

                ${createRating(
                    "Swing Speed",
                    racket.characteristics.swingSpeed
                )}

                ${createRating(
                    "Defense",
                    racket.characteristics.defense
                )}

                ${createRating(
                    "Control",
                    racket.characteristics.control
                )}

                ${createRating(
                    "Repulsion",
                    racket.characteristics.repulsion
                )}

                ${createRating(
                    "Stability",
                    racket.characteristics.stability
                )}

                ${createRating(
                    "Maneuverability",
                    racket.characteristics.maneuverability
                )}

                ${createRating(
                    "Holding",
                    racket.characteristics.holding
                )}

                ${createRating(
                    "Touch",
                    racket.characteristics.touch
                )}

                ${createRating(
                    "Precision",
                    racket.characteristics.precision
                )}

            </div>

        `;

    }


    if (tab === "specs") {

        const specs =
            racket.officialSpecs;


        content.innerHTML = `

            <div class="spec-table">

                ${createSpec(
                    "Weight",
                    specs.weight
                )}

                ${createSpec(
                    "Grip",
                    specs.grip
                )}

                ${createSpec(
                    "Balance",
                    specs.balance
                )}

                ${createSpec(
                    "Shaft Stiffness",
                    specs.shaftStiffness
                )}

                ${createSpec(
                    "Length",
                    specs.length
                )}

                ${createSpec(
                    "Max Tension",
                    specs.maxTension
                )}

                ${createSpec(
                    "Frame Material",
                    specs.frameMaterial
                )}

                ${createSpec(
                    "Shaft Material",
                    specs.shaftMaterial
                )}

                ${createSpec(
                    "Release Year",
                    specs.releaseYear
                )}

            </div>

        `;

    }


    if (tab === "description") {

        content.innerHTML = `

            <div class="description-box">

                <p>
                    ${racket.description}
                </p>


                <div class="description-columns">

                    <div>

                        <h3>
                            Strengths
                        </h3>

                        <ul>

                            ${racket.strengths
                                .map(
                                    item =>
                                        `<li>${item}</li>`
                                )
                                .join("")
                            }

                        </ul>

                    </div>


                    <div>

                        <h3>
                            Suitable For
                        </h3>

                        <ul>

                            ${racket.suitableFor
                                .map(
                                    item =>
                                        `<li>${item}</li>`
                                )
                                .join("")
                            }

                        </ul>

                    </div>

                </div>

            </div>

        `;

    }

}


function createRating(
    name,
    value
) {

    return `

        <div class="rating-row">

            <div class="rating-label">

                <span>
                    ${name}
                </span>

                <strong>
                    ${value}
                </strong>

            </div>


            <div class="rating-bar">

                <div
                    class="rating-fill"
                    style="width:${value * 10}%"
                ></div>

            </div>

        </div>

    `;

}


function createSpec(
    name,
    value
) {

    return `

        <div class="spec-row">

            <span>
                ${name}
            </span>

            <strong>
                ${value || "—"}
            </strong>

        </div>

    `;

}
