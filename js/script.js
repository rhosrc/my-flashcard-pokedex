// Constants - Data that does not change

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

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



// Variables - Data that DOES change

let selectionNum;
let limit;
let offset;
let imageURL;
let musicURL;
let monAPI;
let monArray = [];
let dexArray = [];
let dexEntries;
let numOfTypes;
let firstType;
let firstColor;
let secondType;
let secondColor;



// Cached Element References

const $form = $('form');
const $dex = $('#dex-section');
const $splash = $('.splash');
const $top = $('#page-up');




// Event Listeners

$form.on('submit', handleSubmit);

$(document).on('click', '.card', function (event) {
    $(this).toggleClass('flipped');
})

$(document).ready(function () {
    $(document).on('click', '#play', function (event) {
        $('#loop').prop('volume', 0.05);
        $('#loop').trigger('play');
        $('#play').hide();
        $('#pause').css({
            display: "inline"
        });
        $('#pause').show();
    })

    $(document).on('click', '#pause', function (event) {
        $('#loop').trigger('pause');
        $('#pause').hide();
        $('#play').css({
            display: "inline"
        });
        $('#play').show();
    })
})


// Functions

function handleSubmit(event) {
    // Clears previously selected information, scrolls to top, records generation selected...
    $('#loop').trigger('pause');


    monArray = [];
    dexArray = [];
    $dex.empty();
    event.preventDefault();
    $(document).scrollTop(0);
    selectionNum = $('select option').filter(':selected').val();

    // based on generation chosen, prepares values for header gif and clipping of Pok??mon entries...

    switch (selectionNum) {
        case '1':
            limit = 151;
            offset = 0;
            imageURL = "/images/gen1.gif";
            // musicURL = "/music/gen1.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNjZf/gen1.mp3';
            break;
            
        case '2':
            limit = 100;
            offset = 151;
            imageURL = "/images/gen2.gif";
            // musicURL = "/music/gen2.mp3";
            musicURL = 'https://od.lk/s/MjVfMjQ4NzM0MzJf/03%20Title%20Screen%20%28Gold%20%26%20Silver%20Version%29.mp3';
            break;

        case '3':
            limit = 135;
            offset = 251;
            imageURL = "/images/gen3.gif";
            // musicURL = "/music/gen3.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNjhf/gen3.mp3';
            break;

        case '4':
            limit = 107;
            offset = 386;
            imageURL = "/images/gen4.gif";
            // musicURL = "/music/gen4.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNjlf/gen4.mp3';
            break;
        case '5':
            limit = 156;
            offset = 493;
            imageURL = "/images/gen5.gif";
            // musicURL = "/music/gen5.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNzBf/gen%205.mp3';
            break;

        case '6':
            limit = 72;
            offset = 649;
            imageURL = "/images/gen6.gif";
            // musicURL = "/music/gen6.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNzFf/gen6.mp3';
            break;

        case '7':
            limit = 88;
            offset = 721;
            imageURL = "/images/gen7.gif"
            // musicURL = "/music/gen7.mp3";
            musicURL = 'https://od.lk/s/MjVfMjUxOTgxNzJf/gen7b.mp3';
            break;

        case '8':
            limit = 89;
            offset = 809;
            imageURL = "/images/gen8.gif";
            // musicURL = "/music/gen8.mp3";
            musicURL = 'https://od.lk/s/MjVfMjU2ODYyMDNf/gen8.mp3';
            break;

        default:
            limit = 'No gen selected...';
            break;
    }

    // adds a scroll down and scroll up link to page...

    $splash.html(

        `
        <div id="splash-image">
        <audio id="loop" loop="loop" src=${musicURL}></audio>
        <a href="#drop-down">
            <img id="top" src=${imageURL}>
        <a/>
            <img id="play" src="https://img.icons8.com/ios/50/000000/play--v1.png"/>
        <img id="pause" style="display: none" src="https://img.icons8.com/ios/50/000000/pause--v1.png"
        </div>
        `

    )
    $top.html(
        `<a href="#top"><p>TOP</p></a>`
    )

    // lastly, sends call to the Pok??mon API.

    getMonData();
}

async function getMonData() {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const details = await Promise.all(data.results.map(obj => fetch(obj.url).then(res => res.json())));
    details.sort((a, b) => (a.id > b.id) ? 1 : -1);
    monArray = monArray.concat(details);
    getDexData()
    monRender();
}

async function getDexData() {
    const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    const details = await Promise.all(data.results.map(obj => fetch(obj.url).then(res => res.json())));
    const speciesDeets = await Promise.all(details.map(obj => fetch(obj.species.url).then(res => res.json())));
    speciesDeets.sort((a, b) => (a.id > b.id) ? 1 : -1);
    dexArray = dexArray.concat(speciesDeets);
    dexRender();
}


function monRender() {
    // console.log(monArray)
    for (mon of monArray) {

        // The name of each Pok??mon's primary type is matched via find method to the Types array defined up at line 5. 
        // This returns an object with a corresponding hex code for the card's background color.

        firstType = pokemonTypes.find(obj => {
            return obj.name === mon.types[0].type.name;
        })
        firstColor = firstType.hex;

        // Next, we loop through each Pok??mon's types property (which takes the form of an array) to figure out if it has 2 types, or only one.
        // In the case of 1 type, the array will contain one item (an object), in the case of 2 types, two items (two objects).

        for (let i = 0; i < mon.types.length; i++) {
            numOfTypes = mon.types.length;

            // If it has 2 types, we collect both objects in the array and stop at the second (i.e., last in the array).

            if (numOfTypes === 2) {
                secondType = mon.types[i].type;

                // Otherwise, we set secondType to be identical to the first. 
                // In the CSS, I actually use a right triangle to represent primary type, while the secondary type is a square underneath.
                // So if there is only one type, both will have the same hex code. 
                // Hex codes will be interpolated into the inline CSS that will be appended to each card.

            } else if (numOfTypes === 1) {
                secondType = firstType;
            }

            // Given that we have each Pok??mon's secondType object, 
            // we can run another find method through the names property of the pokemonTypes array to match with each Pok??mon's second type, 
            // which will, again, return an object containing a corresponding hex code.

            let searchOtherType = pokemonTypes.find(obj => {
                return obj.name === secondType.name;
            })
            secondColor = searchOtherType.hex;
        }

        // For the front of each card, we loop through each Pok??mon's set of info, 
        // interpolating information from the original, sorted Pok??mon array that has been passed into this function as an argument.

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

// Dex info goes on the back of each card. Similarly, we pass the sorted array of "species" information to the function as an argument.
// We then loop through each Pok??mon's info. 

function dexRender() {
    for (let i = 0; i < dexArray.length; i++) {

        // For each Pok??mon, we filter to create an array of only English-language Pok??dex entries. 
        // (The array index or position of English-language info changes from Pok??mon to Pok??mon.)

        dexEntries = dexArray[i].flavor_text_entries.filter(obj =>
            obj.language.name === 'en'
        );

        // I'm not picky. We'll just grab the first reference in the array and use that.

        let dexEntry = dexEntries[0].flavor_text;
        $('.entry')[i].append(
            `${dexEntry}`
        )
    }
}