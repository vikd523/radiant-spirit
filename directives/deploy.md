# Deploy PokeSphere to Vercel

## Goal
Build and deploy the PokeSphere app to production at `pokesphere-app.vercel.app`.

## Prerequisites
- `.env` file exists in project root with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Node.js and npm installed
- Vercel CLI installed (`npm i -g vercel`)
- Logged in to Vercel CLI (`vercel login`)

## Steps

1. **Pull latest** — `git pull origin master`
2. **Install deps** — `npm install`
3. **Build locally** — `npm run build`
   - Vite inlines `VITE_*` env vars at build time. If `.env` is missing, the app will show a blank screen in production.
4. **Deploy** — `vercel deploy --prebuilt --prod`
   - Uses the locally-built `dist/` folder (the `--prebuilt` flag).
   - Do NOT use `vercel deploy --prod` without `--prebuilt` — Vercel's build environment won't have the `.env` file.
5. **Verify** — Open `https://pokesphere-app.vercel.app/` and confirm:
   - Landing page renders with POKESPHERE branding
   - Auth modal opens
   - Card images load after login

## Edge Cases
- **Blank screen on Vercel**: 99% chance the `.env` was missing during `npm run build`. Recreate it and rebuild.
- **Card images missing**: Check that `api/pokemontcg/` serverless function deployed correctly. Check Vercel function logs.
- **Supabase errors**: Verify env vars match the Supabase dashboard values.

## Tools Used
- `npm run build` (Vite bundler)
- `vercel deploy --prebuilt --prod` (Vercel CLI)

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-03-01 | Initial creation | Documented deployment workflow from production debugging experience. |
