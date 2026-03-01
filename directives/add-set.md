# Add a New Booster Set

## Goal
Add a new Pokémon TCG expansion to PokeSphere so users can open packs from it.

## Prerequisites
- Know the set ID from the [Pokémon TCG API](https://pokemontcg.io/). Example: `swsh12pt5` = Crown Zenith.
- Know if the set has a gallery/trainer gallery sub-set (e.g., `swsh12pt5gg`).

## Steps

### 1. Generate the Set Data JSON

Edit `execution/fetch-set-data.cjs`:
- Add a new `downloadSet()` call in the `run()` function at the bottom.
- Parameters: `(apiSetId, outputFilename, displayName, seriesName, releaseDate)`

```js
await downloadSet('sv4', 'paradox-rift.json', 'Paradox Rift', 'Scarlet & Violet', '2023-11-03');
```

Run it:
```bash
node execution/fetch-set-data.cjs
```

This creates `src/data/paradox-rift.json`.

### 2. Register the Set in `main.ts`

**Add the import** (top of file, with the other set imports):
```ts
import paradoxRiftData from './data/paradox-rift.json';
```

**Add to the `SETS` record** (inside the `SETS` object):
```ts
'paradox-rift': paradoxRiftData as unknown as SetData,
```

### 3. (Optional) Add Pack Artwork

If you have a pack image URL from TCGPlayer:
1. Add the URL to `execution/fetch-pack-art.cjs`
2. Run `node execution/fetch-pack-art.cjs`
3. The image saves to `public/packs/`

### 4. Verify
- Run `npm run dev`
- Confirm the new pack appears in the horizontal pack carousel
- Open a pack — confirm cards generate with correct rarities
- After API data loads, confirm card images and prices appear

## Edge Cases
- **No gallery sub-set**: Not all sets have one. The `apiGallerySetId` in the JSON is optional.
- **Missing energy cards**: The script adds a fallback energy card if none are found.
- **Rarity mapping mismatches**: The script maps API rarities to our simplified tiers. Check `execution/fetch-set-data.cjs` if a rarity isn't categorized correctly.

## Tools Used
- `execution/fetch-set-data.cjs` — generates the set JSON
- `execution/fetch-pack-art.cjs` — downloads pack artwork (optional)

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-01 | Initial creation | Documented the workflow for adding new expansions. |
