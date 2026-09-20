import { rackets } from "../data/index.js";


const grid =
    document.getElementById("racket-grid");

const searchInput =
    document.getElementById("search-input");

const sortSelect =
    document.getElementById("sort-select");

const count =
    document.getElementById("racket-count");


let selectedBrand = "all";


function renderRackets() {

    let results = [...rackets];


    // Brand filter

    if (selectedBrand !== "all") {

        results = results.filter(
            racket =>
                racket.brand === selectedBrand
        );

    }


    // Search

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search) {

        results = results.filter(racket => {

            const text = `

                ${racket.brand}

                ${racket.model}

                ${racket.series}

                ${racket.category.join(" ")}

            `.toLowerCase();


            return text.includes(search);

        });

    }


    // Sorting

    const sort =
        sortSelect.value;


    if (sort === "smash") {

        results.sort(
            (a, b) =>
                b.characteristics.smashPower -
                a.characteristics.smashPower
        );

    }


    if (sort === "control") {

        results.sort(
            (a, b) =>
                b.characteristics.control -
                a.characteristics.control
        );

    }


    if (sort === "defense") {

        results.sort(
            (a, b) =>
                b.characteristics.defense -
                a.characteristics.defense
        );

    }


    if (sort === "stability") {

        results.sort(
            (a, b) =>
                b.characteristics.stability -
                a.characteristics.stability
        );

    }


    count.textContent =
        `${results.length} rackets`;


    grid.innerHTML = "";


    results.forEach(racket => {

        const card =
            document.createElement("article");


        card.className =
            "racket-card";


        card.innerHTML = `

            <div class="racket-image">

                <img
                    src="${racket.image}"
                    alt="${racket.model}"
                >

            </div>


            <div class="racket-card-info">

                <p class="brand">
                    ${racket.brand}
                </p>

                <h3>
                    ${racket.model}
                </h3>

<p class="racket-meta">
    ${racket.officialSpecs.balance}
    ·
    ${racket.officialSpecs.shaftStiffness}
</p>


                <div class="mini-stats">

                    <span>
                        Smash
                        <strong>
                            ${racket.characteristics.smashPower}
                        </strong>
                    </span>

                    <span>
                        Control
                        <strong>
                            ${racket.characteristics.control}
                        </strong>
                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                window.location.href =
                    `racket.html?id=${racket.id}`;

            }
        );


        grid.appendChild(card);

    });

}


document
    .querySelectorAll(".filter-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-button"
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add("active");


                selectedBrand =
                    button.dataset.brand;


                renderRackets();

            }
        );

    });


searchInput.addEventListener(
    "input",
    renderRackets
);


sortSelect.addEventListener(
    "change",
    renderRackets
);


renderRackets();
