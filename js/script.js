// Constants - Data that does not change

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Variables - Data that DOES change

let selectionNum;
let monAPI;
let monArray = [];
let dexArray = [];
let limit;
let offset;
let imageURL;
let dexEntry;
let firstType;
let firstColor;
let secondColor;
let secondType;
let numOfTypes;



let pokemonTypes = [{
        name: 'bug',
        hex: '#a8b820'
    },
    {
        name: 'dark',
        hex: '#705848'
    },
    {
        name: 'dragon',
        hex: '#7038f8'
    },
    {
        name: 'electric',
        hex: '#f8d030'
    },
    {
        name: 'fairy',
        hex: '#ee99ac'
    },
    {
        name: 'fighting',
        hex: '#c03028'
    },
    {
        name: 'fire',
        hex: '#f08030'
    },
    {
        name: 'flying',
        hex: '#a890f0'
    },
    {
        name: 'ghost',
        hex: '#705898'
    },
    {
        name: 'grass',
        hex: '#78c850'
    },
    {
        name: 'ground',
        hex: '#e0c068'
    },
    {
        name: 'ice',
        hex: '#98d8d8'
    },
    {
        name: 'normal',
        hex: '#a8a878'
    },
    {
        name: 'poison',
        hex: '#a040a0'
    },
    {
        name: 'psychic',
        hex: '#f85888'
    },
    {
        name: 'rock',
        hex: '#b8a038'
    },
    {
        name: 'steel',
        hex: '#b8b8d0'
    },
    {
        name: 'water',
        hex: '#6890f0'
    },
];

// Cached Element References

const $form = $('form');
const $dex = $('#dex-section');
const $card = $('.card .front');
const $splash = $('.splash');
const $top = $('#page-up');
const $diagonal = $('.diagonal');


// Event Listeners
$form.on('submit', handleSubmit);

$(document).on('click', '.card', function (event) {
    $(this).toggleClass('flipped');
})


// Functions


function handleSubmit(event) {
    monArray = [];
    dexArray = [];
    $dex.empty();
    event.preventDefault();
    $(document).scrollTop(0);
    selectionNum = $('select option').filter(':selected').val();

    switch (selectionNum) {
        case '1':
            limit = 151;
            offset = 0;
            imageURL = "https://c.tenor.com/e_esKa2BR0EAAAAC/pokemon-battle-pokemon.gif";
            dexLang = 0;
            break;
        case '2':
            limit = 100;
            offset = 151;
            imageURL = "https://cutewallpaper.org/21/pokemon-background-gif/Pokemon-Gold-PC-Desktop-Background-Animations-UPDATED-.gif";
            dexLang = 0;
            break;

        case '3':
            limit = 135;
            offset = 251;
            imageURL = "https://64.media.tumblr.com/tumblr_ls9dq0o2VH1r3mwpgo1_500.gifv";
            dexLang = 0;
            break;
        case '4':
            limit = 107;
            offset = 386;
            imageURL = "http://www.simbasible.com/wp-content/uploads/2018/03/11-5.gif";
            dexLang = 0;
            break;

        case '5':
            limit = 156;
            offset = 493;
            imageURL = "https://thumbs.gfycat.com/ConventionalPoorBufflehead-size_restricted.gif";
            dexLang = 1;
            break;
        case '6':
            limit = 72;
            offset = 649;
            imageURL = "https://31.media.tumblr.com/f82ce74f536c87ecbcab75b7862ccb27/tumblr_mt4j2cW4iQ1sxmzrgo1_500.gif";
            dexLang = 6;
            break;

        case '7':
            limit = 88;
            offset = 721;
            imageURL = "https://apptrigger.com/files/2016/05/sunmoon1.gif"
            dexLang = 7;
            break;
        case '8':
            limit = 89;
            offset = 809;
            imageURL = "https://thumbs.gfycat.com/CharmingIdolizedCob-size_restricted.gif"
            dexLang = 7;
            break;

        default:
            limit = 'No gen selected...';
            break;
    }

    $splash.html(
        `<a href="#drop-down"><img src=${imageURL}><a>`
    )

    $top.html(
        `<a href="#dex-section"><p>TOP</p></a>`
    )

    apiCall();

}


function apiCall() {

    $.ajax(`${BASE_URL}?limit=${limit}&offset=${offset}`)
        .then(function (monURL) {
            // console.log(monURL);
            monAPI = monURL;

            for (api of monAPI.results) {
                $.ajax(api.url)
                    .then(function (data) {
                        // console.log(data['types']);

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
                                console.log(dexInfo.flavor_text_entries);
                                dexArray.push(dexInfo);
                                // console.log(dexArray);
                            })
                    })
            }

            setTimeout(() => {
                dexArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
                dexRender(dexArray);
                // console.log(dexArray);
            }, 2000);
        })
}


function monRender(monarray) {
    for (mon of monarray) {
        firstType = pokemonTypes.find(obj => {
            return obj.name === mon.types[0].type.name;
        })
        firstColor = firstType.hex;

        for (let i = 0; i < mon.types.length; i++) {
            numOfTypes = mon.types.length;
            // console.log(numOfTypes);
            if (numOfTypes === 2) {
                secondType = mon.types[i].type;
            } else if (numOfTypes === 1){
                secondType = firstType;
            }
            searchOtherType = pokemonTypes.find(obj => {
                return obj.name === secondType.name;
            })
        secondColor = searchOtherType.hex;
        }

        // for (let i=0; i < mon.types.length; i++) {

        // }


        $dex.append(
            `<div class="pkmn-container">
                <p>${mon.id}</p>
                <p><strong>${mon.name.toUpperCase()}</strong></p>
                <div class="container">
                    <div class="card">
                    <div class="front" style="background-color: ${secondColor}">    
                    <div class="diagonal" style="border-right-color: ${firstColor}"> 
                            
                            </div>    
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
        // dexEntry = dexArray.filter(el => el.flavor_text_entries.language.name === 'en');
        // console.log(dexEntry);
        $('.entry')[i].append(
            `${dexArray[i].flavor_text_entries[dexLang].flavor_text}`
        )
    }
}