/**
 * bake-images.mjs — One-time script to pre-bake Pokémon TCG card image URLs
 * into custom set JSON files.
 *
 * Usage: node execution/bake-images.mjs
 *
 * For each custom set JSON, this script:
 *   1. Collects all unique card names
 *   2. Strips variant suffixes (ex, Mega, V, etc.) to get base Pokémon names
 *   3. Queries the public Pokémon TCG API for each base name
 *   4. Picks the best card image (most recent set)
 *   5. Writes an `imageMap` dictionary into the JSON file
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'src', 'data');

const API_BASE = 'https://api.pokemontcg.io/v2';

const CUSTOM_SETS = [
    'mega-evolution.json',
    'phantasmal-flames.json',
    'ascended-heroes.json',
];

/** Strip variant suffixes to get the base Pokémon name */
function toBaseName(name) {
    return name
        .replace(/^Mega /i, '')
        .replace(/ ex$/i, '')
        .replace(/ V$/i, '')
        .replace(/ VMAX$/i, '')
        .replace(/ VSTAR$/i, '')
        .replace(/ GX$/i, '')
        .replace(/ EX$/i, '')
        .trim();
}

/** Sleep helper */
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/** Fetch a card image from the Pokémon TCG API by name */
async function fetchCardImage(name) {
    const query = encodeURIComponent(`name:"${name}"`);
    const url = `${API_BASE}/cards?q=${query}&pageSize=5&page=1&select=id,name,images&orderBy=-set.releaseDate`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`  ⚠ API returned ${res.status} for "${name}"`);
            return null;
        }
        const json = await res.json();
        if (json.data && json.data.length > 0) {
            const card = json.data[0]; // Most recent set first
            return {
                small: card.images.small,
                large: card.images.large,
            };
        }
        return null;
    } catch (err) {
        console.warn(`  ⚠ Fetch failed for "${name}":`, err.message);
        return null;
    }
}

async function processSet(filename) {
    const filepath = resolve(DATA_DIR, filename);
    console.log(`\n━━━ Processing ${filename} ━━━`);

    const data = JSON.parse(readFileSync(filepath, 'utf-8'));

    // Collect all unique card names across all rarities
    const allNames = new Set();
    for (const rarityCards of Object.values(data.cards)) {
        for (const card of rarityCards) {
            allNames.add(card.name);
        }
    }

    console.log(`  Found ${allNames.size} unique card names`);

    // Group by base name to avoid duplicate lookups
    const baseToOriginals = new Map();
    for (const name of allNames) {
        const base = toBaseName(name);
        if (!baseToOriginals.has(base)) baseToOriginals.set(base, []);
        baseToOriginals.get(base).push(name);
    }

    console.log(`  ${baseToOriginals.size} unique base names to look up`);

    const imageMap = {};
    let found = 0;
    let missed = 0;
    let i = 0;

    for (const [baseName, originals] of baseToOriginals) {
        i++;
        process.stdout.write(`  [${i}/${baseToOriginals.size}] Looking up "${baseName}"...`);

        const images = await fetchCardImage(baseName);

        if (images) {
            // Map all variant names to the same image
            for (const origName of originals) {
                imageMap[origName] = images;
            }
            found += originals.length;
            console.log(` ✓ (${originals.length} variant${originals.length > 1 ? 's' : ''})`);
        } else {
            missed += originals.length;
            console.log(` ✗ NOT FOUND`);
        }

        // Rate-limit: 300ms between requests
        await sleep(300);
    }

    // Write imageMap into the JSON data
    data.imageMap = imageMap;
    writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`\n  ✅ Done! ${found} cards with images, ${missed} missed.`);
    console.log(`  📄 Saved to ${filename}`);
}

// ─── Main ────────────────────────────────────────────
async function main() {
    console.log('🎴 Pokémon TCG Image Baker');
    console.log('════════════════════════════════════════');

    for (const setFile of CUSTOM_SETS) {
        await processSet(setFile);
    }

    console.log('\n════════════════════════════════════════');
    console.log('🎉 All custom sets processed!');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
