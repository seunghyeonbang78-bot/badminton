import { rackets } from "../data/index.js";


const container =
    document.getElementById(
        "featured-rackets"
    );


if (container) {

    rackets
        .slice(0, 3)
        .forEach(racket => {

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
                    </p>

                </div>

            `;


            card.onclick = () => {

                window.location.href =
                    `racket.html?id=${racket.id}`;

            };


            container.appendChild(card);

        });

}
