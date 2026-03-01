/**
 * Price Engine — Market value calculation and formatting.
 */

import type { PackCard } from './pack-generator';
import type { CardLookupEntry } from '../api/api-client';

/** Format a price in USD */
export function formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined) return '—';
    if (price < 0.01) return '<$0.01';
    return `$${price.toFixed(2)}`;
}

/** Get the most appropriate market price for a card */
export function getMarketPrice(card: PackCard, lookup: CardLookupEntry | undefined): number | null {
    if (!lookup) return null;

    const prices = lookup.allPrices;

    // For reverse holo cards, prefer reverseHolofoil price
    if (card.isReverseHolo && prices.reverseHolofoil !== undefined) {
        return prices.reverseHolofoil;
    }

    // For holo rare and above, prefer holofoil price
    if (['holo_rare', 'ultra_rare', 'full_art', 'secret_rare', 'gold', 'radiant', 'gallery'].includes(card.rarity)) {
        if (prices.holofoil !== undefined && prices.holofoil !== null) return prices.holofoil;
    }

    // Default to the highest available price
    return lookup.marketPrice;
}

/** Calculate total pack value */
export function calculatePackValue(cards: PackCard[]): number {
    return cards.reduce((total, card) => total + (card.marketPrice ?? 0), 0);
}

/** Sort cards by price descending for "Top Pulls" */
export function getTopPulls(cards: PackCard[], count: number = 3): PackCard[] {
    return [...cards]
        .filter(c => (c.marketPrice ?? 0) > 0)
        .sort((a, b) => (b.marketPrice ?? 0) - (a.marketPrice ?? 0))
        .slice(0, count);
}

/** Determine value tier for visual treatment */
export function getValueTier(price: number | null): 'bulk' | 'playable' | 'chase' | 'treasure' {
    if (!price || price < 0.50) return 'bulk';
    if (price < 5.00) return 'playable';
    if (price < 25.00) return 'chase';
    return 'treasure';
}

/** Format a date string from the API (e.g., "2024/01/15") */
export function formatPriceDate(dateStr: string | null): string {
    if (!dateStr) return 'Unknown';
    try {
        const d = new Date(dateStr.replace(/\//g, '-'));
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
}
