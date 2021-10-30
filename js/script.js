// Constants - Data that does not change

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Variables - Data that DOES change

let generationNum;

let monAPI;
let monStats;
let speciesStats;
let dexAPI;
let dexEntry;
let monArray = [];
let dexArray = [];


// Cached Element References

const $form = $('form');
const $dex = $('#dex-section');
const $card = $('.card-inner');

// Event Listeners
$form.on('submit', handleSubmit);

$(document).on('click', '.card', function (event) {
    $(this).toggleClass('flipped');
})


// Functions


function handleSubmit(event) {
    $dex.empty();
    event.preventDefault();
    $(document).scrollTop(0);
    generationNum = $('select option').filter(':selected').val();
    apiCall();

}


function apiCall() {
    $.ajax(`${BASE_URL}?limit=151`)
        .then(function (monURL) {

            monAPI = monURL;

            for (api of monAPI.results) {
                $.ajax(api.url)
                    .then(function (data) {
                        // console.log(data);
                        monArray.push(data);
                    })
            }

            setTimeout(() => {
                monArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
                // console.log('Monnnn', monArray);
                monRender(monArray);
            }, 2000);

            for (api of monAPI.results) {
                $.ajax(api.url)
                    .then(function (data) {
                        $.ajax(data.species.url)
                            .then(function (dexInfo) {
                                dexArray.push(dexInfo);
                                // console.log(dexArray);
                            })
                    })

            }

            setTimeout(() => {
                dexArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
                dexRender(dexArray);
            }, 2000);   
        })
}



function monRender(monarray) {
    for (mon of monarray) {
        $dex.append(
            `<div class="pkmn-container">
            <p>${mon.id}</p>
            <p><strong>${mon.name.toUpperCase()}</strong></p><div class="container">
            <div class="card"> 
                <div class="front">
                <img class="imeji" src="${mon.sprites.other["official-artwork"].front_default}">
                </div>
                <div class="back">
                <p class="entry"></p>
                </div>
            </div>
        </div>
        <div class="details">
        <p>Weighs ${Math.floor(mon.weight / 4.536)} lbs</p>
        <p>${Math.floor(mon.height * 3.937)} inches tall</p>
        </div>
            </div> 
            `
        )

    }
}

function dexRender() {
    // console.log(dexArray.length);
    for (let i = 0; i < dexArray.length; i++) {
        $('.entry')[i].append(
            `${dexArray[i].flavor_text_entries[1].flavor_text}`
        )
    }
}