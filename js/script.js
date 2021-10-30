// Constants - Data that does not change

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Variables - Data that DOES change

let physicalData;
let dexData;
let generationNum;
let pageDex = [];
let totalDex = [];

let monAPI;
let monStats;
let dexAPI;
let dexEntry;
let monArray = [];

// class Cardcontainer {
//     constructor(cardFront, cardBack) {
//         this.cardFront = cardFront;
//         this.cardBack = cardBack;
//     }
// }

// Cached Element References

const $form = $('form');
const $dex = $('#dex-section');
const $card = $('.card-inner');
const $entry = $('.back');

// Event Listeners
$form.on('submit', handleSubmit);

$(document).on('click', '.card', function(event){
    $(this).toggleClass('flipped');
})


// Functions


function handleSubmit(event) {
    totalDex.length = 0;
    pageDex.length = 0;
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
            // console.log(monAPI);
            monCall();
        })
}





function monCall() {

    for (let i = 0; i < monAPI.results.length; i++) {
        $.ajax(`${monAPI.results[i].url}`)
            .then(function (monObj) {
                monStats = monObj;
                // monArray.push(monStats);
                // monArray = monStats.map(({id, name, weight, height, sprites}) => ({id, name, weight, height, sprites}));
                monRender();
                // localStorage.setItem("monInfo", JSON.stringify(monStats));
                // console.log(monStats);

            })


}

}

function apiCall2() {
    console.log(monArray);
    $.ajax(`${BASE_URL}-species`)
        .then(function (dexURL) {
            dexAPI = dexURL;
            // console.log(dexAPI);
            dexCall();
            // console.log(monStats);
        })
}

function dexCall() {
    for (let i = 0; i < dexAPI.results.length; i++) {
        $.ajax(`${dexAPI.results[i].url}`)
            .then(function (dexObj) {
                dexEntry = dexObj;
                // console.log(dexEntry);
                // console.log(dexEntry.flavor_text_entries[0].flavor_text);
                // dexRender();
            })
    }
}

function monRender() {
    $dex.append(
        `<div class="pkmn-container">
        <p>${monStats.id}</p>
        <p><strong>${monStats.name.toUpperCase()}</strong></p><div class="container">
        <div class="card"> 
            <div class="front">
            <img class="imeji" src="${monStats.sprites.other["official-artwork"].front_default}">
            </div>
            <div class="back">
            </div>
        </div>
    </div>
    <div class="details">
    <p>Weighs ${Math.floor(monStats.weight / 4.536)} lbs</p>
    <p>${Math.floor(monStats.height * 3.937)} inches tall</p>
    </div>
        </div> 
        `
    )
}

function dexRender() {
    $('.card .back').html(
        `<p class="entry">${dexEntry.flavor_text_entries[0].flavor_text}</p>`
    )
}