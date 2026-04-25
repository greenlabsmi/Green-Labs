/**
 * GREEN LABS DIGITAL COLLECTIBLES
 * Logic for localStorage-based card binder.
 */

const GL_STORAGE_KEY = "greenlabs_collected_cards_v1";

// CARD DATABASE: Update image paths, rewards, and descriptions here.
const GL_CARDS = [
  {
    id: "lemon-wookie",
    name: "Lemon Wookie",
    rarity: "Legendary",
    type: "Citrus Power",
    image: "assets/img/strains/lemon-wookie-art.jpg", // Correct root-relative path
    reward: "$2 off Lemon Wookie deli flower",
    teaser: "Award-winning citrus power. Legendary card perk.",
    collectUrl: "collect/lemon-wookie.html"
  },
  {
    id: "hash-d",
    name: "Hash D",
    rarity: "Rare",
    type: "Hash Heavy",
    image: "assets/img/strains/hash-d-2-art.jpg", 
    reward: "$1 off Hash D deli flower",
    teaser: "Rich, heavy, old-school hash energy with a collectible perk.",
    collectUrl: "collect/hash-d.html"
  },
  {
    id: "dead-prez",
    name: "Dead Prez",
    rarity: "Rare",
    type: "Power Drop",
    image: "assets/img/strains/dead-prez-art.png",
    reward: "$1 off Dead Prez deli flower",
    teaser: "A bold strain card with a reward built for serious collectors.",
    collectUrl: "collect/dead-prez.html"
  },
  {
    id: "banana-split",
    name: "Banana Split",
    rarity: "Uncommon",
    type: "Dessert Drop",
    image: "assets/img/strains/banana-split-art.jpg",
    reward: "Free lighter with Banana Split purchase",
    teaser: "Sweet dessert-style energy with a fun collectible bonus.",
    collectUrl: "collect/banana-split.html"
  },
  {
    id: "cobra-lips",
    name: "Cobra Lips",
    rarity: "Uncommon",
    type: "Exotic Bite",
    image: "assets/img/strains/cobra-lips-art.jpg",
    reward: "$1 off any deli eighth",
    teaser: "Exotic, sharp, and built for collectors chasing the full set.",
    collectUrl: "collect/cobra-lips.html"
  }
];

// ... (keep your getCollectedCards, saveCollectedCards, etc. functions here)

// HELPER FUNCTIONS
function getCollectedCards() {
  const data = localStorage.getItem(GL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCollectedCards(cards) {
  localStorage.setItem(GL_STORAGE_KEY, JSON.stringify(cards));
}

function collectCard(cardId) {
  let collected = getCollectedCards();
  if (!collected.includes(cardId)) {
    collected.push(cardId);
    saveCollectedCards(collected);
    return true; // New card added
  }
  return false; // Already owned
}

function getCardById(cardId) {
  return GL_CARDS.find(c => c.id === cardId);
}

function resetCollection() {
  if(confirm("Are you sure? This will wipe your entire collection.")) {
    localStorage.removeItem(GL_STORAGE_KEY);
    location.reload();
  }
}
