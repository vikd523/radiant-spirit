# Price Sync & API Enrichment

## Goal
Understand how live market prices are loaded from the Pokémon TCG API and applied to cards in PokeSphere.

## How It Works

### Data Flow
1. User logs in → `loadApiData()` fires for the active set
2. `fetchSetCards(apiSetId)` calls `api.pokemontcg.io/v2/cards?q=set.id:{id}`
3. Response is parsed into a `CardLookupMap` (keyed by `name|number`)
4. When a pack is opened, `enrichPack()` matches each generated card to its API entry
5. Match provides: `imageSmall`, `imageLarge`, `marketPrice`, `tcgplayerUrl`

### Matching Strategy
- **Primary**: Composite key `{name.toLowerCase()}|{number}`
- **Fallback**: Fuzzy name match — same name, prefer matching rarity
- All fuzzy matches log a `[Match]` warning to console

### Price Source
- `tcgplayer.prices` from the API response
- Priority order: `1stEditionHolofoil` → `holofoil` → `reverseHolofoil` → `normal` → `unlimited`
- Stored as `marketPrice` on each `PackCard`

### Caching
- API responses cached in `localStorage` with key `pokesphere_cache_{setId}`
- TTL: 24 hours
- `clearCache()` available to force re-fetch

## Edge Cases
- **Gallery sub-sets** (e.g., `swsh12pt5gg`): Fetched separately and merged into the main lookup map.
- **Rate limiting**: The API has no explicit key requirement but may throttle. Pagination handled in `api-client.ts`.
- **Vercel production**: Uses `/api/pokemontcg/` serverless proxy to avoid CORS. Locally, Vite's dev proxy handles it.
- **Missing prices**: Some cards (especially energy) have no TCGPlayer listing. These show no price badge.

## Tools Used
- `src/api/api-client.ts` — API fetching, caching, lookup map building
- `src/engine/price-engine.ts` — price extraction, formatting, value tiers
- `api/pokemontcg/[...path].ts` — Vercel serverless proxy

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-01 | Initial creation | Documented the price enrichment pipeline and known edge cases. |
