import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api/pokemontcg': {
                target: 'https://api.pokemontcg.io',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/pokemontcg/, ''),
                configure: (proxy) => {
                    proxy.on('error', (err) => {
                        console.log('[Proxy] Error:', err.message);
                    });
                    proxy.on('proxyReq', (proxyReq, req) => {
                        console.log('[Proxy] →', req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req) => {
                        console.log('[Proxy] ←', proxyRes.statusCode, req.url);
                    });
                },
            },
        },
    },
});
