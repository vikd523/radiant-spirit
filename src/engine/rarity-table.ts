/**
 * Rarity constants, display metadata, and type-to-color mapping.
 */

export const RARITY_DISPLAY: Record<string, { label: string; tier: number }> = {
    common: { label: 'Common', tier: 0 },
    uncommon: { label: 'Uncommon', tier: 1 },
    rare: { label: 'Rare', tier: 2 },
    holo_rare: { label: 'Holo Rare', tier: 3 },
    ultra_rare: { label: 'Ultra Rare', tier: 4 },
    radiant: { label: 'Radiant', tier: 4 },
    full_art: { label: 'Full Art', tier: 5 },
    secret_rare: { label: 'Secret Rare', tier: 6 },
    gold: { label: 'Gold', tier: 7 },
    gallery: { label: 'Gallery', tier: 4 },
    energy: { label: 'Energy', tier: -1 },
    reverse_holo: { label: 'Reverse Holo', tier: 1 },
};

export const TYPE_COLORS: Record<string, string> = {
    Grass: '#4caf50',
    Fire: '#e74c3c',
    Water: '#2196f3',
    Electric: '#f1c40f',
    Psychic: '#9b59b6',
    Fighting: '#e67e22',
    Dark: '#34495e',
    Metal: '#95a5a6',
    Dragon: '#6c3483',
    Normal: '#bdc3c7',
    Trainer: '#1abc9c',
    Fairy: '#e91e63',
};

export const TYPE_GRADIENTS: Record<string, string> = {
    Grass: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
    Fire: 'linear-gradient(135deg, #b71c1c 0%, #ff5722 100%)',
    Water: 'linear-gradient(135deg, #0d47a1 0%, #42a5f5 100%)',
    Electric: 'linear-gradient(135deg, #f57f17 0%, #ffeb3b 100%)',
    Psychic: 'linear-gradient(135deg, #4a148c 0%, #ce93d8 100%)',
    Fighting: 'linear-gradient(135deg, #bf360c 0%, #ff9800 100%)',
    Dark: 'linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)',
    Metal: 'linear-gradient(135deg, #455a64 0%, #b0bec5 100%)',
    Dragon: 'linear-gradient(135deg, #311b92 0%, #7e57c2 100%)',
    Normal: 'linear-gradient(135deg, #616161 0%, #e0e0e0 100%)',
    Trainer: 'linear-gradient(135deg, #00695c 0%, #26a69a 100%)',
    Fairy: 'linear-gradient(135deg, #880e4f 0%, #f48fb1 100%)',
};

/** Returns true if a rarity should trigger special effects */
export function isHit(rarity: string): boolean {
    const tier = RARITY_DISPLAY[rarity]?.tier ?? 0;
    return tier >= 3;
}

/** Returns true for ultra/secret/gold rarity */
export function isBigHit(rarity: string): boolean {
    const tier = RARITY_DISPLAY[rarity]?.tier ?? 0;
    return tier >= 5;
}

/** Returns true for secret/gold rarity (biggest hits) */
export function isJackpot(rarity: string): boolean {
    const tier = RARITY_DISPLAY[rarity]?.tier ?? 0;
    return tier >= 6;
}
