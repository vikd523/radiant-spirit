import fs from 'fs';

const GITHUB_BASE = 'https://raw.githubusercontent.com/PokemonTCG/pokemon-tcg-data/master/cards/en';

const typeToEmoji: Record<string, string> = {
    'Colorless': '⚪',
    'Darkness': '🟣',
    'Dragon': '🐉',
    'Fairy': '🧚',
    'Fighting': '🪨',
    'Fire': '🔥',
    'Grass': '🌿',
    'Lightning': '⚡',
    'Metal': '⚙️',
    'Psychic': '👁️',
    'Water': '💧'
};

function getEmoji(types?: string[]) {
    if (!types || types.length === 0) return '🎭';
    return typeToEmoji[types[0]] || '✨';
}

async function fetchSet(id: string) {
    const res = await fetch(`${GITHUB_BASE}/${id}.json`);
    if (!res.ok) return [];
    return await res.json();
}

function processCards(cards: any[]) {
    const db: Record<string, any[]> = {
        energy: [],
        common: [],
        uncommon: [],
        rare: [],
        holo_rare: [],
        ultra_rare: [],
        secret_rare: [],
        gallery: []
    };

    for (const c of cards) {
        const rarity = (c.rarity || '').toLowerCase();
        const supertype = (c.supertype || '').toLowerCase();

        const cardObj = {
            number: c.number,
            name: c.name,
            type: c.types ? c.types[0] : supertype,
            emoji: getEmoji(c.types)
        };

        if (supertype === 'energy' && !rarity.includes('secret')) {
            db.energy.push(cardObj);
            continue; // Only add basic energy to energy pool
        }

        if (c.id.includes('tg') || c.id.includes('gg')) {
            db.gallery.push(cardObj);
        } else if (rarity.includes('secret') || rarity.includes('gold') || rarity.includes('hyper')) {
            db.secret_rare.push(cardObj);
        } else if (rarity.includes('ultra') || rarity.includes('vmax') || rarity.includes('vstar') || rarity.includes('full art')) {
            db.ultra_rare.push(cardObj);
        } else if (rarity.includes('holo') && (rarity.includes(' v') || rarity.includes(' ex'))) {
            db.ultra_rare.push(cardObj); // V/ex are usually ultra rare tier in our simple generator
        } else if (rarity.includes('holo')) {
            db.holo_rare.push(cardObj);
        } else if (rarity.includes('rare')) {
            db.rare.push(cardObj);
        } else if (rarity.includes('uncommon')) {
            db.uncommon.push(cardObj);
        } else if (rarity.includes('common')) {
            db.common.push(cardObj);
        } else {
            // fallback
            db.common.push(cardObj);
        }
    }
    return db;
}

async function syncSet(file: string, mainId: string, galleryId?: string) {
    console.log(`Syncing ${file}...`);
    const mainCards = await fetchSet(mainId);
    let allCards = [...mainCards];

    if (galleryId) {
        const galleryCards = await fetchSet(galleryId);
        allCards = allCards.concat(galleryCards);
    }

    const original = JSON.parse(fs.readFileSync(file, 'utf-8'));
    original.cards = processCards(allCards);

    // Quick fix for reverse holo pools (our generator logic expects these arrays)
    if (!original.cards.energy || original.cards.energy.length === 0) {
        original.cards.energy = [{ number: 'E', name: 'Basic Energy', type: 'Energy', emoji: '⚡' }];
    }

    fs.writeFileSync(file, JSON.stringify(original, null, 2));
    console.log(`Saved ${file} with ${allCards.length} authentic cards!`);
}

async function run() {
    await syncSet('./src/data/crown-zenith.json', 'swsh12pt5', 'swsh12pt5gg');
    await syncSet('./src/data/silver-tempest.json', 'swsh12', 'swsh12tg');
}

run();
