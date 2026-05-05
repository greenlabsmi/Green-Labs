// assets/js/dutchamon-db.js

const GL_CARDS = [
    // --- 15 READY CARDS (Using -card.jpg) ---
    { id: 'field-trip', name: 'The Magic Dutch Bus', image: 'assets/img/strains/field-trip-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'death-z', name: 'Death Z', image: 'assets/img/strains/death-z-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'lemon-wookie', name: 'Lemon Wookie', image: 'assets/img/strains/lemon-wookie-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa-Hybrid' },
    { id: 'pb-chocolate', name: 'PB n Chocolate', image: 'assets/img/strains/pb-n-chocolate-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'cobra-lips', name: 'Cobra Lips', image: 'assets/img/strains/cobra-lips-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'solo-walker', name: 'Solo Walker', image: 'assets/img/strains/solo-walker-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'hash-d', name: 'Hash D', image: 'assets/img/strains/hash-d-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: '13-layer-cake', name: '13 Layer Cake', image: 'assets/img/strains/13-layer-cake-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'bubblegum-88g13hp', name: 'Bubble Gum 88G13', image: 'assets/img/strains/bubblegum-88g13hp-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'hash-d-alt', name: 'Hash D (Alt Variant)', image: 'assets/img/strains/hash-d-alt-card.jpg', reward: 'Special Promo Reward', rarity: 'Limited Edition' },
    { id: 'super-silver-hashplant', name: 'Super Silver Hashplant', image: 'assets/img/strains/super-silver-hashplant-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'sin-city-grapes', name: 'Sin City Grapes', image: 'assets/img/strains/sin-city-grapes-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'lilac-diesel', name: 'Lilac Diesel', image: 'assets/img/strains/lilac-diesel-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'mr-clean', name: 'Mr. Clean', image: 'assets/img/strains/mr-clean-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'clusterfunk', name: 'Clusterfunk', image: 'assets/img/strains/clusterfunk-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },

    // --- PLANNED CARDS (Using -art.jpg as placeholders) ---
    { id: 'orange-kush-cake', name: 'Orange Kush Cake', image: 'assets/img/strains/orange-kush-cake-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'strawberry-daiquiri', name: 'Strawberry Daiquiri', image: 'assets/img/strains/strawberry-daiquiri-art.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'pina-rita', name: 'Pina Rita', image: 'assets/img/strains/pina-rita-art.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'garlic-breath', name: 'Garlic Breath', image: 'assets/img/strains/garlic-breath-art.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'falcon-9', name: 'Falcon 9', image: 'assets/img/strains/falcon-9-art.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'banana-split', name: 'Banana Split', image: 'assets/img/strains/banana-split-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'guicy-g', name: 'Guicy G', image: 'assets/img/strains/guicy-g-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'gorilla-88', name: 'Gorilla 88', image: 'assets/img/strains/gorilla-88-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'face-off', name: 'Face Off', image: 'assets/img/greenlabs-logo.png', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'choc-marshmallows', name: 'Choc Marshmallows', image: 'assets/img/strains/chocolate-marshmellow-11-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'muel-fuel', name: 'Muel Fuel', image: 'assets/img/greenlabs-logo.png', reward: '$1 Off 1/8th', rarity: 'Indica' },

    // --- STORE EXPLORER EDITIONS ---
    { id: 'bodyguards', name: 'The Bodyguards', image: 'assets/img/hero.jpg', reward: 'Security Secret Discount', rarity: 'Store Special' },
    { id: 'chalkboard', name: 'The Chalkboard', image: 'assets/img/greenlabs-logo.png', reward: 'Free Sticker', rarity: 'Explorer Series' },
    { id: 'painting', name: 'The Masterpiece', image: 'assets/img/greenlabs-logo.png', reward: 'Free Pre-roll', rarity: 'Explorer Series' },
    { id: 'merch-area', name: 'Merch Master', image: 'assets/img/greenlabs-logo.png', reward: '10% Off Apparel', rarity: 'Store Series' },
    { id: 'accessory-area', name: 'Tool Kit', image: 'assets/img/greenlabs-logo.png', reward: '5% Off Glass', rarity: 'Store Series' }
];

const GL_SETS = [
    { id: 'jedi', name: 'Jedi Council', reward: 'Reward: 20% Off Set', cardIds: ['lemon-wookie', 'falcon-9', 'solo-walker', 'death-z'] },
    { id: 'bakery', name: 'The Dutch Bakery', reward: 'Reward: Free Edible', cardIds: ['13-layer-cake', 'banana-split', 'pb-chocolate', 'choc-marshmallows'] },
    { id: 'academy', name: 'High-Octane Academy', reward: 'Reward: Free Lighter', cardIds: ['field-trip', 'mr-clean', 'lilac-diesel', 'cobra-lips'] },
    { id: 'hash-masters', name: 'The Hash Masters', reward: 'Reward: $10 Store Credit', cardIds: ['hash-d', 'super-silver-hp', 'hash-d-alt'] },
    { id: 'explorer', name: 'Store Explorer', reward: 'Reward: Legendary Mystery Bag', cardIds: ['bodyguards', 'chalkboard', 'painting', 'merch-area', 'accessory-area'] }
];
