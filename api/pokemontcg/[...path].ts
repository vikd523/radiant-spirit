import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Proxy for the Pokemon TCG API.
 *
 * The pokemontcg.io API does not send CORS headers, so browser
 * fetch() calls from our Vercel-hosted SPA get blocked.
 * This catch-all API route proxies requests through our own domain,
 * adding the correct CORS headers so the browser is happy.
 *
 * Locally, Vite's dev proxy handles this via vite.config.ts.
 * In production on Vercel, THIS serverless function handles it.
 *
 * Route: /api/pokemontcg/v2/cards?q=set.id:swsh12pt5&...
 *   -> proxied to: https://api.pokemontcg.io/v2/cards?q=set.id:swsh12pt5&...
 */

const UPSTREAM = 'https://api.pokemontcg.io';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Build upstream URL from the catch-all path segments
    const pathSegments = req.query.path;
    const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '';
    const qs = new URLSearchParams(req.query as Record<string, string>);
    qs.delete('path'); // Remove the catch-all param

    const upstreamUrl = `${UPSTREAM}/${path}${qs.toString() ? '?' + qs.toString() : ''}`;

    try {
        const upstream = await fetch(upstreamUrl, {
            method: req.method || 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        const body = await upstream.text();

        // Set CORS headers so the browser allows the response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        // Cache for 1 hour at the edge to reduce upstream calls
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');

        res.status(upstream.status).send(body);
    } catch (err: any) {
        console.error('[Proxy] Upstream fetch failed:', err?.message);
        res.status(502).json({ error: 'Upstream API unreachable', details: err?.message });
    }
}
