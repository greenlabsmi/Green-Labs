const GL_CARDS = [
    // === SET 1: THE JEDI COUNCIL ===
    { id: 'lemon-wookie', name: 'Lemon Wookie', image: 'assets/img/strains/lemon-wookie-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica-Hybrid' },
    { id: 'falcon-9', name: 'Falcon 9', image: 'assets/img/strains/falcon-9-art.jpg', reward: '$1 Off 1/8th', rarity: 'Indica-Dominant' },
    { id: 'solo-walker', name: 'Solo Walker', image: 'assets/img/strains/solo-walker-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'death-z', name: 'Death Z', image: 'assets/img/strains/death-z-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'death-funk', name: 'Death X Funk', image: 'assets/img/greenlabs-logo.png', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'death-star', name: 'Death Star', image: 'assets/img/strains/greenlabs-logo.png', reward: '$1 Off 1/8th', rarity: 'Indica' },

    // === SET 2: THE DUTCH BAKERY ===
    { id: '13-layer-cake', name: '13 Layer Cake', image: 'assets/img/strains/13-layer-cake-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'banana-split', name: 'Banana Split', image: 'assets/img/strains/banana-split-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'pb-chocolate', name: 'PB n Chocolate', image: 'assets/img/strains/pb-n-chocolate-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'choc-marshmallows', name: 'Choc Marshmallows', image: 'assets/img/strains/chocolate-marshmellow-11-art.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'sin-city-grapes', name: 'Sin City Grapes', image: 'assets/img/strains/sin-city-grapes-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },

    // === SET 3: HIGH-OCTANE ACADEMY ===
    { id: 'field-trip', name: 'The Magic Dutch Bus', image: 'assets/img/strains/field-trip-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'mr-clean', name: 'Mr. Clean', image: 'assets/img/strains/mr-clean-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'lilac-diesel', name: 'Lilac Diesel', image: 'assets/img/strains/lilac-diesel-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'super-silver-hashplant', name: 'Super Silver Hashplant', image: 'assets/img/strains/super-silver-hashplant-card.jpg', reward: '$1 Off 1/8th', rarity: 'Sativa' },
    { id: 'cobra-lips', name: 'Cobra Lips', image: 'assets/img/strains/cobra-lips-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },

    // === SET 4: THE HASH MASTERS ===
    { id: 'hash-d', name: 'Hash D', image: 'assets/img/strains/hash-d-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },
    { id: 'hash-d-alt', name: 'Hash D (Variant)', image: 'assets/img/strains/hash-d-alt-card.jpg', reward: 'Special Promo', rarity: 'Limited Edition' },
    { id: 'bubblegum-88g13hp', name: 'Bubble Gum 88G13', image: 'assets/img/strains/bubblegum-88g13hp-card.jpg', reward: '$1 Off 1/8th', rarity: 'Hybrid' },
    { id: 'clusterfunk', name: 'Clusterfunk', image: 'assets/img/strains/clusterfunk-card.jpg', reward: '$1 Off 1/8th', rarity: 'Indica' },

    // === SET 5: STORE EXPLORER ===
    { id: 'bodyguards', name: 'The Bodyguards', image: 'assets/img/hero.jpg', reward: 'Security Discount', rarity: 'Store Special' },
    { id: 'chalkboard', name: 'The Chalkboard', image: 'assets/img/greenlabs-logo.png', reward: 'Free Sticker', rarity: 'Explorer Series' }
];

const GL_SETS = [
    { id: 'jedi', name: 'Jedi Council', reward: '20% Off Set', cardIds: ['lemon-wookie', 'falcon-9', 'solo-walker', 'death-z'] },
    { id: 'bakery', name: 'The Dutch Bakery', reward: 'Free Edible', cardIds: ['13-layer-cake', 'banana-split', 'pb-chocolate', 'choc-marshmallows', 'sin-city-grapes'] },
    { id: 'academy', name: 'High-Octane Academy', reward: 'Free Lighter', cardIds: ['field-trip', 'mr-clean', 'lilac-diesel', 'super-silver-hashplant', 'cobra-lips'] },
    { id: 'hash-masters', name: 'The Hash Masters', reward: '$10 Store Credit', cardIds: ['hash-d', 'hash-d-alt', 'bubblegum-88g13hp', 'clusterfunk'] },
    { id: 'explorer', name: 'Store Explorer', reward: 'Mystery Bag', cardIds: ['bodyguards', 'chalkboard'] }
];
