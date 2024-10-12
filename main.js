let gold = 0;
let bullets = 0;
let guns = 0;
let dollars = 0;
let goldPerSec = 0;

// Business data
const businesses = {
    goldMine: { owned: 0, goldPerSec: 1, cost: 10 },
    saloon: { owned: 0, goldPerSec: 5, cost: 100 },
    ranch: { owned: 0, goldPerSec: 20, cost: 500 },
    gunsmith: { owned: 0, gunPerSec: 1, bulletPerSec: 10, cost: 1000 }
};

// UI Elements
const goldDisplay = document.getElementById('gold');
const bulletsDisplay = document.getElementById('bullets');
const gunsDisplay = document.getElementById('guns');
const dollarsDisplay = document.getElementById('dollars');
const goldPerSecDisplay = document.getElementById('goldPerSec');

// Buttons
const mineGoldBtn = document.getElementById('mineGoldBtn');
const upgradeBtns = document.querySelectorAll('.upgradeBtn');

// Function to update the displayed values
function updateDisplay() {
    goldDisplay.textContent = gold.toFixed(2);
    bulletsDisplay.textContent = bullets.toFixed(2);
    gunsDisplay.textContent = guns.toFixed(2);
    dollarsDisplay.textContent = dollars.toFixed(2);
    goldPerSecDisplay.textContent = goldPerSec.toFixed(2);

    // Update costs and owned counts for all businesses
    for (let business in businesses) {
        const costElement = document.getElementById(`${business}Cost`);
        const ownedElement = document.getElementById(`${business}Owned`);
        
        // Check if elements exist before updating their content
        if (costElement) {
            costElement.textContent = businesses[business].cost;
        }
        if (ownedElement) {
            ownedElement.textContent = businesses[business].owned;
        }
    }
}

// Function to mine gold manually
mineGoldBtn.addEventListener('click', () => {
    gold += 1;
    updateDisplay();
});

// Function to buy upgrades
upgradeBtns.forEach(button => {
    button.addEventListener('click', () => {
        const business = button.getAttribute('data-business');
        if (gold >= businesses[business].cost) {
            gold -= businesses[business].cost;
            businesses[business].owned += 1;

            // Adjust production rates for the purchased business
            if (business === 'gunsmith') {
                // Gunsmith produces bullets and guns
                businesses[business].gunPerSec = businesses[business].owned * 1;
                businesses[business].bulletPerSec = businesses[business].owned * 10;
            } else {
                // Update total gold production per second
                goldPerSec += businesses[business].goldPerSec;
            }

            // Increase the cost for the next purchase
            businesses[business].cost = Math.floor(businesses[business].cost * 1.5);
            updateDisplay();
        }
    });
});

// Function to generate resources over time
setInterval(() => {
    // Increment gold, bullets, and guns based on current production rates
    gold += goldPerSec;
    bullets += businesses.gunsmith.bulletPerSec * businesses.gunsmith.owned;
    guns += businesses.gunsmith.gunPerSec * businesses.gunsmith.owned;
    updateDisplay();
}, 1000);

// Autosave and Autoload Functions
function saveGame() {
    const gameData = {
        gold,
        bullets,
        guns,
        dollars,
        goldPerSec,
        businesses
    };
    localStorage.setItem('wildWestTycoonSave', JSON.stringify(gameData));
    console.log('Game saved!');
}

function loadGame() {
    const savedData = localStorage.getItem('wildWestTycoonSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        gold = gameData.gold;
        bullets = gameData.bullets;
        guns = gameData.guns;
        dollars = gameData.dollars;
        goldPerSec = gameData.goldPerSec;
        Object.assign(businesses, gameData.businesses);
        console.log('Game loaded!');
        updateDisplay();
    }
}

// Autosave every 5 seconds
setInterval(saveGame, 5000);

// Load the game on startup
window.addEventListener('load', () => {
    loadGame();
});

// Initial update
updateDisplay();
